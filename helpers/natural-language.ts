import { MAX_FLOOR, MIN_FLOOR } from '@/constants/elevator';

export type CommandAction =
  | 'StartElevator'
  | 'EndElevator'
  | 'UpLevelElevator'
  | 'DownLevelElevator'
  | 'StopElevator'
  | 'OpenDoorCloseDoor';

export type ParseErrorCode =
  | 'EMPTY_PROGRAM'
  | 'MISSING_START'
  | 'MISSING_END'
  | 'INVALID_COMMAND'
  | 'INVALID_START_COMMAND'
  | 'INVALID_END_COMMAND'
  | 'INVALID_LEVEL'
  | 'INVALID_CHANNEL'
  | 'MISSING_NEWLINE'
  | 'MULTIPLE_START'
  | 'UNEXPECTED_AFTER_END'
  | 'FLOOR_ABOVE_MAX'
  | 'FLOOR_BELOW_MIN';

export type ParsedCommand = {
  action: CommandAction;
  line: number;
  level?: number;
  channel?: number;
};

export type ParseError = {
  code: ParseErrorCode;
  line: number;
  message: string;
};

export type ParseResult = {
  success: boolean;
  commands: ParsedCommand[];
  errors: ParseError[];
};

type CommandPattern = {
  action: CommandAction;
  pattern: RegExp;
  extract?: (match: RegExpMatchArray) => Pick<ParsedCommand, 'level' | 'channel'>;
};

const COMMAND_PATTERNS: CommandPattern[] = [
  {
    action: 'UpLevelElevator',
    pattern: /^\s*[Ss]\s+([1-6])\n+/,
    extract: (match) => ({ level: Number(match[1]) }),
  },
  {
    action: 'DownLevelElevator',
    pattern: /^\s*[Bb]\s+([1-6])\n+/,
    extract: (match) => ({ level: Number(match[1]) }),
  },
  {
    action: 'StopElevator',
    pattern: /^\s*[Pp]\s+([1-9])\n+/,
    extract: (match) => ({ channel: Number(match[1]) }),
  },
  {
    action: 'OpenDoorCloseDoor',
    pattern: /^\s*[Aa]\s+([1-9])\n+/,
    extract: (match) => ({ channel: Number(match[1]) }),
  },
  {
    action: 'StartElevator',
    pattern: /^\s*[Ii]\s*\n+/,
  },
  {
    action: 'EndElevator',
    pattern: /^\s*[Ff]\n*/,
  },
];

function getLineNumber(input: string, position: number): number {
  return input.slice(0, position).split('\n').length;
}

function getRawLineContent(input: string, line: number): string {
  return input.split('\n')[line - 1] ?? '';
}

function getLineSnippet(input: string, line: number): string {
  return getRawLineContent(input, line).trim();
}

function isValidStartCommandLine(lineContent: string): boolean {
  return /^\s*[Ii]\s*$/.test(lineContent);
}

function isValidEndCommandLine(lineContent: string): boolean {
  return /^\s*[Ff]$/.test(lineContent);
}

function createError(
  code: ParseErrorCode,
  line: number,
  input: string,
): ParseError {
  const snippet = getLineSnippet(input, line);
  const suffix = snippet ? `: "${snippet}"` : '';

  const messages: Record<ParseErrorCode, string> = {
    EMPTY_PROGRAM: 'El programa está vacío.',
    MISSING_START: 'El programa debe comenzar con el comando I (inicio de elevador).',
    MISSING_END: 'El programa debe terminar con el comando F (fin de elevador).',
    INVALID_COMMAND: `Comando no reconocido en la línea ${line}${suffix}.`,
    INVALID_START_COMMAND: `El comando I solo puede ser la letra I o i, sin números ni texto adicional (línea ${line}${suffix}).`,
    INVALID_END_COMMAND: `El comando F solo puede ser la letra F o f, sin números ni texto adicional (línea ${line}${suffix}).`,
    INVALID_LEVEL: `Nivel inválido en la línea ${line}${suffix}. Use un número del 1 al 6 para S o B.`,
    INVALID_CHANNEL: `Canal inválido en la línea ${line}${suffix}. Use un número del 1 al 9 para P o A.`,
    MISSING_NEWLINE: `Falta un salto de línea después del comando en la línea ${line}${suffix}.`,
    MULTIPLE_START: `Solo puede haber un comando I (inicio) en el programa (línea ${line}${suffix}).`,
    UNEXPECTED_AFTER_END: `Hay contenido después del comando F (fin) en la línea ${line}${suffix}.`,
    FLOOR_ABOVE_MAX: `No puede subir más: el elevador no puede pasar del piso ${MAX_FLOOR} (línea ${line}${suffix}).`,
    FLOOR_BELOW_MIN: `No puede bajar más: el elevador no puede ir por debajo del piso ${MIN_FLOOR} (línea ${line}${suffix}).`,
  };

  return { code, line, message: messages[code] };
}

function detectErrorAt(input: string, position: number): ParseError {
  const remaining = input.slice(position);
  const line = getLineNumber(input, position);

  const levelCommand = remaining.match(/^\s*([SsBb])\s+(\d+)/);
  if (levelCommand) {
    const level = Number(levelCommand[2]);
    if (level < 1 || level > 6) {
      return createError('INVALID_LEVEL', line, input);
    }
  }

  const channelCommand = remaining.match(/^\s*([PpAa])\s+(\d+)/);
  if (channelCommand) {
    const channel = Number(channelCommand[2]);
    if (channel < 1 || channel > 9) {
      return createError('INVALID_CHANNEL', line, input);
    }
  }

  const missingSpace = remaining.match(/^\s*([SsBbPpAa])(\d)/);
  if (missingSpace) {
    return createError('INVALID_COMMAND', line, input);
  }

  const invalidStartCommand = remaining.match(/^\s*[Ii]\s*(\S)/);
  if (invalidStartCommand) {
    return createError('INVALID_START_COMMAND', line, input);
  }

  const invalidEndCommand = remaining.match(/^\s*[Ff](?:\s+.*|\d)/);
  if (invalidEndCommand) {
    return createError('INVALID_END_COMMAND', line, input);
  }

  const missingNewline = remaining.match(
    /^\s*([SsBbPpAa])(?:\s+\d+)?(?![\n\r])/,
  );
  if (missingNewline) {
    return createError('MISSING_NEWLINE', line, input);
  }

  return createError('INVALID_COMMAND', line, input);
}

function skipToNextLine(input: string, position: number): number {
  const nextNewline = input.indexOf('\n', position);
  return nextNewline === -1 ? input.length : nextNewline + 1;
}

function getFirstNonBlankLine(
  input: string,
): { line: number; content: string } | null {
  const lines = input.split('\n');

  for (let index = 0; index < lines.length; index += 1) {
    const content = lines[index].trim();
    if (content) {
      return { line: index + 1, content };
    }
  }

  return null;
}

function validateProgramStart(input: string, errors: ParseError[]): void {
  const firstLine = getFirstNonBlankLine(input);
  if (!firstLine) {
    return;
  }

  const rawLine = getRawLineContent(input, firstLine.line);

  if (/^\s*[Ii]/.test(rawLine.trim())) {
    if (!isValidStartCommandLine(rawLine)) {
      errors.push(createError('INVALID_START_COMMAND', firstLine.line, input));
    }
    return;
  }

  errors.push(createError('MISSING_START', firstLine.line, input));
}

function validateLineFormats(input: string, errors: ParseError[]): void {
  const lines = input.split('\n');
  const incompleteLineNumber = getIncompleteLastLineNumber(input);

  lines.forEach((lineContent, index) => {
    const line = index + 1;
    const trimmed = lineContent.trim();

    if (!trimmed) {
      return;
    }

    const isIncomplete = incompleteLineNumber === line;
    if (isIncomplete && isIncompleteLineStillValid(lineContent)) {
      return;
    }

    if (/^[Ii]/.test(trimmed)) {
      if (!isValidStartCommandLine(lineContent)) {
        errors.push(createError('INVALID_START_COMMAND', line, input));
      }
      return;
    }

    if (/^[Ff]/.test(trimmed)) {
      if (!isValidEndCommandLine(lineContent)) {
        errors.push(createError('INVALID_END_COMMAND', line, input));
      }
      return;
    }

    if (/^[Ss]/.test(trimmed) && !/^\s*[Ss]\s+[1-6]\s*$/.test(lineContent)) {
      const levelMatch = trimmed.match(/^[Ss]\s+(\d+)/);
      if (levelMatch) {
        const level = Number(levelMatch[1]);
        if (level < 1 || level > 6) {
          errors.push(createError('INVALID_LEVEL', line, input));
          return;
        }
      }
      errors.push(createError('INVALID_COMMAND', line, input));
      return;
    }

    if (/^[Bb]/.test(trimmed) && !/^\s*[Bb]\s+[1-6]\s*$/.test(lineContent)) {
      const levelMatch = trimmed.match(/^[Bb]\s+(\d+)/);
      if (levelMatch) {
        const level = Number(levelMatch[1]);
        if (level < 1 || level > 6) {
          errors.push(createError('INVALID_LEVEL', line, input));
          return;
        }
      }
      errors.push(createError('INVALID_COMMAND', line, input));
      return;
    }

    if (/^[Pp]/.test(trimmed) && !/^\s*[Pp]\s+[1-9]\s*$/.test(lineContent)) {
      const channelMatch = trimmed.match(/^[Pp]\s+(\d+)/);
      if (channelMatch) {
        const channel = Number(channelMatch[1]);
        if (channel < 1 || channel > 9) {
          errors.push(createError('INVALID_CHANNEL', line, input));
          return;
        }
      }
      errors.push(createError('INVALID_COMMAND', line, input));
      return;
    }

    if (/^[Aa]/.test(trimmed) && !/^\s*[Aa]\s+[1-9]\s*$/.test(lineContent)) {
      const channelMatch = trimmed.match(/^[Aa]\s+(\d+)/);
      if (channelMatch) {
        const channel = Number(channelMatch[1]);
        if (channel < 1 || channel > 9) {
          errors.push(createError('INVALID_CHANNEL', line, input));
          return;
        }
      }
      errors.push(createError('INVALID_COMMAND', line, input));
      return;
    }

    if (!/^[SsBbPpAaFfIi]/.test(trimmed)) {
      errors.push(createError('INVALID_COMMAND', line, input));
    }
  });
}

function getIncompleteLastLineNumber(input: string): number | null {
  if (input.length === 0 || input.endsWith('\n')) {
    return null;
  }

  return input.split('\n').length;
}

function isIncompleteLineStillValid(lineContent: string): boolean {
  const trimmed = lineContent.trim();
  if (!trimmed) {
    return true;
  }

  if (/^[Ii]/.test(trimmed)) {
    return isValidStartCommandLine(lineContent);
  }

  if (/^[Ff]/.test(trimmed)) {
    return isValidEndCommandLine(lineContent);
  }

  if (/^[Ss](?:\s*[1-6]?)?$/.test(trimmed)) {
    return true;
  }

  if (/^[Bb](?:\s*[1-6]?)?$/.test(trimmed)) {
    return true;
  }

  if (/^[Pp](?:\s*[1-9]?)?$/.test(trimmed)) {
    return true;
  }

  if (/^[Aa](?:\s*[1-9]?)?$/.test(trimmed)) {
    return true;
  }

  return false;
}

function filterRealtimeErrors(input: string, errors: ParseError[]): ParseError[] {
  const incompleteLineNumber = getIncompleteLastLineNumber(input);
  if (incompleteLineNumber === null) {
    return errors;
  }

  const incompleteLineContent = getRawLineContent(input, incompleteLineNumber);
  const incompleteLineStillValid = isIncompleteLineStillValid(incompleteLineContent);

  return errors.filter((error) => {
    if (error.code === 'MISSING_END') {
      return false;
    }

    if (error.line !== incompleteLineNumber) {
      return true;
    }

    if (error.code === 'MISSING_NEWLINE') {
      return false;
    }

    if (
      (error.code === 'INVALID_COMMAND' ||
        error.code === 'INVALID_START_COMMAND' ||
        error.code === 'INVALID_END_COMMAND') &&
      incompleteLineStillValid
    ) {
      return false;
    }

    return true;
  });
}

function validateStructure(
  input: string,
  commands: ParsedCommand[],
  errors: ParseError[],
): void {
  if (commands.length === 0) {
    return;
  }

  const startCommands = commands.filter(
    (command) => command.action === 'StartElevator',
  );

  if (startCommands.length > 1) {
    for (const command of startCommands.slice(1)) {
      errors.push(createError('MULTIPLE_START', command.line, input));
    }
  }

  const lastCommand = commands[commands.length - 1];
  if (lastCommand?.action !== 'EndElevator') {
    errors.push(
      createError('MISSING_END', lastCommand?.line ?? getLineNumber(input, input.length), input),
    );
  }

  const endIndex = commands.findIndex((command) => command.action === 'EndElevator');
  if (endIndex !== -1) {
    for (const command of commands.slice(endIndex + 1)) {
      errors.push(createError('UNEXPECTED_AFTER_END', command.line, input));
    }
  }
}

function clampReferenceFloor(referenceFloor: number): number {
  return Math.min(MAX_FLOOR, Math.max(MIN_FLOOR, referenceFloor));
}

function validateFloorBounds(
  input: string,
  commands: ParsedCommand[],
  referenceFloor: number,
  errors: ParseError[],
): void {
  let currentFloor = clampReferenceFloor(referenceFloor);

  for (const command of commands) {
    if (
      command.action !== 'UpLevelElevator' &&
      command.action !== 'DownLevelElevator'
    ) {
      continue;
    }

    const steps = command.level;
    if (steps === undefined || steps < 1) {
      continue;
    }

    const direction = command.action === 'UpLevelElevator' ? 1 : -1;

    for (let moveIndex = 0; moveIndex < steps; moveIndex += 1) {
      const nextFloor = currentFloor + direction;

      if (nextFloor > MAX_FLOOR) {
        errors.push(createError('FLOOR_ABOVE_MAX', command.line, input));
        break;
      }

      if (nextFloor < MIN_FLOOR) {
        errors.push(createError('FLOOR_BELOW_MIN', command.line, input));
        break;
      }

      currentFloor = nextFloor;
    }
  }
}

export type ParseOptions = {
  realtime?: boolean;
  referenceFloor?: number;
};

export function parseNaturalLanguage(
  input: string,
  options: ParseOptions = { realtime: true },
): ParseResult {
  const errors: ParseError[] = [];
  const commands: ParsedCommand[] = [];

  const trimmed = input.trim();
  if (!trimmed) {
    return {
      success: false,
      commands: [],
      errors: [createError('EMPTY_PROGRAM', 1, input)],
    };
  }

  let position = 0;

  while (position < input.length) {
    const blankLine = input.slice(position).match(/^\s*\n/);
    if (blankLine) {
      position += blankLine[0].length;
      continue;
    }

    let matched = false;

    for (const { action, pattern, extract } of COMMAND_PATTERNS) {
      const match = input.slice(position).match(pattern);
      if (!match) {
        continue;
      }

      const line = getLineNumber(input, position);
      const command: ParsedCommand = {
        action,
        line,
        ...extract?.(match),
      };

      commands.push(command);
      position += match[0].length;
      matched = true;
      break;
    }

    if (matched) {
      continue;
    }

    errors.push(detectErrorAt(input, position));
    const nextPosition = skipToNextLine(input, position);

    if (nextPosition === position) {
      break;
    }

    position = nextPosition;
  }

  validateProgramStart(input, errors);
  validateLineFormats(input, errors);
  validateStructure(input, commands, errors);
  validateFloorBounds(
    input,
    commands,
    options.referenceFloor ?? MIN_FLOOR,
    errors,
  );

  const uniqueErrors = errors.filter((error, index, list) => {
    const specificCodes = new Set<ParseErrorCode>([
      'INVALID_START_COMMAND',
      'INVALID_END_COMMAND',
      'INVALID_LEVEL',
      'INVALID_CHANNEL',
      'FLOOR_ABOVE_MAX',
      'FLOOR_BELOW_MIN',
    ]);
    const linesWithSpecificError = new Set(
      list.filter((item) => specificCodes.has(item.code)).map((item) => item.line),
    );

    if (
      error.code === 'INVALID_COMMAND' &&
      linesWithSpecificError.has(error.line)
    ) {
      return false;
    }

    return (
      list.findIndex(
        (item) => item.code === error.code && item.line === error.line,
      ) === index
    );
  });

  const filteredErrors =
    options.realtime === false
      ? uniqueErrors
      : filterRealtimeErrors(input, uniqueErrors);

  return {
    success: filteredErrors.length === 0,
    commands,
    errors: filteredErrors,
  };
}
