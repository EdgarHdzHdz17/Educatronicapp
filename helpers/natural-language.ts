import { MAX_FLOOR, MIN_FLOOR } from '@/constants/elevator';

export type CommandAction =
  | 'StartElevator'
  | 'EndElevator'
  | 'UpLevelElevator'
  | 'DownLevelElevator'
  | 'StopElevator'
  | 'OpenDoorCloseDoor';

export type CommandLanguage = 'es' | 'en';

export type CommandLabels = {
  start: string;
  end: string;
  up: string;
  down: string;
  stop: string;
  open: string;
};

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

type CommandLanguageDefinition = {
  lang: CommandLanguage;
  labels: CommandLabels;
  patterns: CommandPattern[];
  startClass: string;
  endClass: string;
  upClass: string;
  downClass: string;
  stopClass: string;
  openClass: string;
  levelClass: string;
  channelClass: string;
  allCommandClass: string;
};

const SPANISH_DEFINITION: CommandLanguageDefinition = {
  lang: 'es',
  labels: {
    start: 'I',
    end: 'F',
    up: 'S',
    down: 'B',
    stop: 'P',
    open: 'A',
  },
  patterns: [
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
  ],
  startClass: 'Ii',
  endClass: 'Ff',
  upClass: 'Ss',
  downClass: 'Bb',
  stopClass: 'Pp',
  openClass: 'Aa',
  levelClass: 'SsBb',
  channelClass: 'PpAa',
  allCommandClass: 'SsBbPpAaFfIi',
};

const ENGLISH_DEFINITION: CommandLanguageDefinition = {
  lang: 'en',
  labels: {
    start: 'S',
    end: 'E',
    up: 'U',
    down: 'D',
    stop: 'P',
    open: 'O',
  },
  patterns: [
    {
      action: 'UpLevelElevator',
      pattern: /^\s*[Uu]\s+([1-6])\n+/,
      extract: (match) => ({ level: Number(match[1]) }),
    },
    {
      action: 'DownLevelElevator',
      pattern: /^\s*[Dd]\s+([1-6])\n+/,
      extract: (match) => ({ level: Number(match[1]) }),
    },
    {
      action: 'StopElevator',
      pattern: /^\s*[Pp]\s+([1-9])\n+/,
      extract: (match) => ({ channel: Number(match[1]) }),
    },
    {
      action: 'OpenDoorCloseDoor',
      pattern: /^\s*[Oo]\s+([1-9])\n+/,
      extract: (match) => ({ channel: Number(match[1]) }),
    },
    {
      action: 'StartElevator',
      pattern: /^\s*[Ss]\s*\n+/,
    },
    {
      action: 'EndElevator',
      pattern: /^\s*[Ee]\n*/,
    },
  ],
  startClass: 'Ss',
  endClass: 'Ee',
  upClass: 'Uu',
  downClass: 'Dd',
  stopClass: 'Pp',
  openClass: 'Oo',
  levelClass: 'UuDd',
  channelClass: 'PpOo',
  allCommandClass: 'SsEeUuDdPpOo',
};

const LANGUAGE_DEFINITIONS: Record<CommandLanguage, CommandLanguageDefinition> = {
  es: SPANISH_DEFINITION,
  en: ENGLISH_DEFINITION,
};

export function normalizeCommandLanguage(language?: string): CommandLanguage {
  return language?.toLowerCase().startsWith('en') ? 'en' : 'es';
}

export function getCommandLabels(language: CommandLanguage = 'es'): CommandLabels {
  return { ...LANGUAGE_DEFINITIONS[language].labels };
}

function getDefinition(language?: CommandLanguage): CommandLanguageDefinition {
  return LANGUAGE_DEFINITIONS[language ?? 'es'];
}

function getLineNumber(input: string, position: number): number {
  return input.slice(0, position).split('\n').length;
}

function getRawLineContent(input: string, line: number): string {
  return input.split('\n')[line - 1] ?? '';
}

function getLineSnippet(input: string, line: number): string {
  return getRawLineContent(input, line).trim();
}

function isValidStartCommandLine(
  lineContent: string,
  definition: CommandLanguageDefinition,
): boolean {
  return new RegExp(`^\\s*[${definition.startClass}]\\s*$`).test(lineContent);
}

function isValidEndCommandLine(
  lineContent: string,
  definition: CommandLanguageDefinition,
): boolean {
  return new RegExp(`^\\s*[${definition.endClass}]$`).test(lineContent);
}

function createError(
  code: ParseErrorCode,
  line: number,
  input: string,
  definition: CommandLanguageDefinition,
): ParseError {
  const snippet = getLineSnippet(input, line);
  const suffix = snippet ? `: "${snippet}"` : '';
  const { labels } = definition;
  const levelCommands = `${labels.up} or ${labels.down}`;
  const channelCommands = `${labels.stop} or ${labels.open}`;

  const messages: Record<ParseErrorCode, string> =
    definition.lang === 'en'
      ? {
          EMPTY_PROGRAM: 'The program is empty.',
          MISSING_START: `The program must start with command ${labels.start} (start elevator).`,
          MISSING_END: `The program must end with command ${labels.end} (end elevator).`,
          INVALID_COMMAND: `Unrecognized command on line ${line}${suffix}.`,
          INVALID_START_COMMAND: `Command ${labels.start} must be only the letter ${labels.start} (uppercase or lowercase), with no numbers or extra text (line ${line}${suffix}).`,
          INVALID_END_COMMAND: `Command ${labels.end} must be only the letter ${labels.end} (uppercase or lowercase), with no numbers or extra text (line ${line}${suffix}).`,
          INVALID_LEVEL: `Invalid level on line ${line}${suffix}. Use a number from 1 to 6 for ${levelCommands}.`,
          INVALID_CHANNEL: `Invalid channel on line ${line}${suffix}. Use a number from 1 to 9 for ${channelCommands}.`,
          MISSING_NEWLINE: `Missing newline after the command on line ${line}${suffix}.`,
          MULTIPLE_START: `There can only be one ${labels.start} (start) command in the program (line ${line}${suffix}).`,
          UNEXPECTED_AFTER_END: `There is content after the ${labels.end} (end) command on line ${line}${suffix}.`,
          FLOOR_ABOVE_MAX: `Cannot go up further: the elevator cannot go above floor ${MAX_FLOOR} (line ${line}${suffix}).`,
          FLOOR_BELOW_MIN: `Cannot go down further: the elevator cannot go below floor ${MIN_FLOOR} (line ${line}${suffix}).`,
        }
      : {
          EMPTY_PROGRAM: 'El programa está vacío.',
          MISSING_START: `El programa debe comenzar con el comando ${labels.start} (inicio de elevador).`,
          MISSING_END: `El programa debe terminar con el comando ${labels.end} (fin de elevador).`,
          INVALID_COMMAND: `Comando no reconocido en la línea ${line}${suffix}.`,
          INVALID_START_COMMAND: `El comando ${labels.start} solo puede ser la letra ${labels.start} o ${labels.start.toLowerCase()}, sin números ni texto adicional (línea ${line}${suffix}).`,
          INVALID_END_COMMAND: `El comando ${labels.end} solo puede ser la letra ${labels.end} o ${labels.end.toLowerCase()}, sin números ni texto adicional (línea ${line}${suffix}).`,
          INVALID_LEVEL: `Nivel inválido en la línea ${line}${suffix}. Use un número del 1 al 6 para ${labels.up} o ${labels.down}.`,
          INVALID_CHANNEL: `Canal inválido en la línea ${line}${suffix}. Use un número del 1 al 9 para ${labels.stop} o ${labels.open}.`,
          MISSING_NEWLINE: `Falta un salto de línea después del comando en la línea ${line}${suffix}.`,
          MULTIPLE_START: `Solo puede haber un comando ${labels.start} (inicio) en el programa (línea ${line}${suffix}).`,
          UNEXPECTED_AFTER_END: `Hay contenido después del comando ${labels.end} (fin) en la línea ${line}${suffix}.`,
          FLOOR_ABOVE_MAX: `No puede subir más: el elevador no puede pasar del piso ${MAX_FLOOR} (línea ${line}${suffix}).`,
          FLOOR_BELOW_MIN: `No puede bajar más: el elevador no puede ir por debajo del piso ${MIN_FLOOR} (línea ${line}${suffix}).`,
        };

  return { code, line, message: messages[code] };
}

function detectErrorAt(
  input: string,
  position: number,
  definition: CommandLanguageDefinition,
): ParseError {
  const remaining = input.slice(position);
  const line = getLineNumber(input, position);

  const levelCommand = remaining.match(
    new RegExp(`^\\s*([${definition.levelClass}])\\s+(\\d+)`),
  );
  if (levelCommand) {
    const level = Number(levelCommand[2]);
    if (level < 1 || level > 6) {
      return createError('INVALID_LEVEL', line, input, definition);
    }
  }

  const channelCommand = remaining.match(
    new RegExp(`^\\s*([${definition.channelClass}])\\s+(\\d+)`),
  );
  if (channelCommand) {
    const channel = Number(channelCommand[2]);
    if (channel < 1 || channel > 9) {
      return createError('INVALID_CHANNEL', line, input, definition);
    }
  }

  const missingSpace = remaining.match(
    new RegExp(`^\\s*([${definition.levelClass}${definition.channelClass}])(\\d)`),
  );
  if (missingSpace) {
    return createError('INVALID_COMMAND', line, input, definition);
  }

  const invalidStartCommand = remaining.match(
    new RegExp(`^\\s*[${definition.startClass}]\\s*(\\S)`),
  );
  if (invalidStartCommand) {
    return createError('INVALID_START_COMMAND', line, input, definition);
  }

  const invalidEndCommand = remaining.match(
    new RegExp(`^\\s*[${definition.endClass}](?:\\s+.*|\\d)`),
  );
  if (invalidEndCommand) {
    return createError('INVALID_END_COMMAND', line, input, definition);
  }

  const missingNewline = remaining.match(
    new RegExp(
      `^\\s*([${definition.levelClass}${definition.channelClass}])(?:\\s+\\d+)?(?![\\n\\r])`,
    ),
  );
  if (missingNewline) {
    return createError('MISSING_NEWLINE', line, input, definition);
  }

  return createError('INVALID_COMMAND', line, input, definition);
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

function validateProgramStart(
  input: string,
  errors: ParseError[],
  definition: CommandLanguageDefinition,
): void {
  const firstLine = getFirstNonBlankLine(input);
  if (!firstLine) {
    return;
  }

  const rawLine = getRawLineContent(input, firstLine.line);

  if (new RegExp(`^\\s*[${definition.startClass}]`).test(rawLine.trim())) {
    if (!isValidStartCommandLine(rawLine, definition)) {
      errors.push(
        createError('INVALID_START_COMMAND', firstLine.line, input, definition),
      );
    }
    return;
  }

  errors.push(createError('MISSING_START', firstLine.line, input, definition));
}

function validateParameterizedLine(
  lineContent: string,
  line: number,
  input: string,
  errors: ParseError[],
  definition: CommandLanguageDefinition,
  letterClass: string,
  range: 'level' | 'channel',
): boolean {
  const trimmed = lineContent.trim();
  const validPattern = new RegExp(
    range === 'level'
      ? `^\\s*[${letterClass}]\\s+[1-6]\\s*$`
      : `^\\s*[${letterClass}]\\s+[1-9]\\s*$`,
  );

  if (!new RegExp(`^[${letterClass}]`).test(trimmed)) {
    return false;
  }

  if (validPattern.test(lineContent)) {
    return true;
  }

  const valueMatch = trimmed.match(new RegExp(`^[${letterClass}]\\s+(\\d+)`));
  if (valueMatch) {
    const value = Number(valueMatch[1]);
    if (range === 'level' && (value < 1 || value > 6)) {
      errors.push(createError('INVALID_LEVEL', line, input, definition));
      return true;
    }
    if (range === 'channel' && (value < 1 || value > 9)) {
      errors.push(createError('INVALID_CHANNEL', line, input, definition));
      return true;
    }
  }

  errors.push(createError('INVALID_COMMAND', line, input, definition));
  return true;
}

function validateLineFormats(
  input: string,
  errors: ParseError[],
  definition: CommandLanguageDefinition,
): void {
  const lines = input.split('\n');
  const incompleteLineNumber = getIncompleteLastLineNumber(input);

  lines.forEach((lineContent, index) => {
    const line = index + 1;
    const trimmed = lineContent.trim();

    if (!trimmed) {
      return;
    }

    const isIncomplete = incompleteLineNumber === line;
    if (isIncomplete && isIncompleteLineStillValid(lineContent, definition)) {
      return;
    }

    if (new RegExp(`^[${definition.startClass}]`).test(trimmed)) {
      if (!isValidStartCommandLine(lineContent, definition)) {
        errors.push(createError('INVALID_START_COMMAND', line, input, definition));
      }
      return;
    }

    if (new RegExp(`^[${definition.endClass}]`).test(trimmed)) {
      if (!isValidEndCommandLine(lineContent, definition)) {
        errors.push(createError('INVALID_END_COMMAND', line, input, definition));
      }
      return;
    }

    if (
      validateParameterizedLine(
        lineContent,
        line,
        input,
        errors,
        definition,
        definition.upClass,
        'level',
      )
    ) {
      return;
    }

    if (
      validateParameterizedLine(
        lineContent,
        line,
        input,
        errors,
        definition,
        definition.downClass,
        'level',
      )
    ) {
      return;
    }

    if (
      validateParameterizedLine(
        lineContent,
        line,
        input,
        errors,
        definition,
        definition.stopClass,
        'channel',
      )
    ) {
      return;
    }

    if (
      validateParameterizedLine(
        lineContent,
        line,
        input,
        errors,
        definition,
        definition.openClass,
        'channel',
      )
    ) {
      return;
    }

    if (!new RegExp(`^[${definition.allCommandClass}]`).test(trimmed)) {
      errors.push(createError('INVALID_COMMAND', line, input, definition));
    }
  });
}

function getIncompleteLastLineNumber(input: string): number | null {
  if (input.length === 0 || input.endsWith('\n')) {
    return null;
  }

  return input.split('\n').length;
}

function isIncompleteLineStillValid(
  lineContent: string,
  definition: CommandLanguageDefinition,
): boolean {
  const trimmed = lineContent.trim();
  if (!trimmed) {
    return true;
  }

  if (new RegExp(`^[${definition.startClass}]`).test(trimmed)) {
    return isValidStartCommandLine(lineContent, definition);
  }

  if (new RegExp(`^[${definition.endClass}]`).test(trimmed)) {
    return isValidEndCommandLine(lineContent, definition);
  }

  if (new RegExp(`^[${definition.upClass}](?:\\s*[1-6]?)?$`).test(trimmed)) {
    return true;
  }

  if (new RegExp(`^[${definition.downClass}](?:\\s*[1-6]?)?$`).test(trimmed)) {
    return true;
  }

  if (new RegExp(`^[${definition.stopClass}](?:\\s*[1-9]?)?$`).test(trimmed)) {
    return true;
  }

  if (new RegExp(`^[${definition.openClass}](?:\\s*[1-9]?)?$`).test(trimmed)) {
    return true;
  }

  return false;
}

function filterRealtimeErrors(
  input: string,
  errors: ParseError[],
  definition: CommandLanguageDefinition,
): ParseError[] {
  const incompleteLineNumber = getIncompleteLastLineNumber(input);
  if (incompleteLineNumber === null) {
    return errors;
  }

  const incompleteLineContent = getRawLineContent(input, incompleteLineNumber);
  const incompleteLineStillValid = isIncompleteLineStillValid(
    incompleteLineContent,
    definition,
  );

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
  definition: CommandLanguageDefinition,
): void {
  if (commands.length === 0) {
    return;
  }

  const startCommands = commands.filter(
    (command) => command.action === 'StartElevator',
  );

  if (startCommands.length > 1) {
    for (const command of startCommands.slice(1)) {
      errors.push(createError('MULTIPLE_START', command.line, input, definition));
    }
  }

  const lastCommand = commands[commands.length - 1];
  if (lastCommand?.action !== 'EndElevator') {
    errors.push(
      createError(
        'MISSING_END',
        lastCommand?.line ?? getLineNumber(input, input.length),
        input,
        definition,
      ),
    );
  }

  const endIndex = commands.findIndex((command) => command.action === 'EndElevator');
  if (endIndex !== -1) {
    for (const command of commands.slice(endIndex + 1)) {
      errors.push(createError('UNEXPECTED_AFTER_END', command.line, input, definition));
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
  definition: CommandLanguageDefinition,
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
        errors.push(createError('FLOOR_ABOVE_MAX', command.line, input, definition));
        break;
      }

      if (nextFloor < MIN_FLOOR) {
        errors.push(createError('FLOOR_BELOW_MIN', command.line, input, definition));
        break;
      }

      currentFloor = nextFloor;
    }
  }
}

export type ParseOptions = {
  realtime?: boolean;
  referenceFloor?: number;
  commandLanguage?: CommandLanguage;
};

export function parseNaturalLanguage(
  input: string,
  options: ParseOptions = { realtime: true },
): ParseResult {
  const definition = getDefinition(options.commandLanguage);
  const errors: ParseError[] = [];
  const commands: ParsedCommand[] = [];

  const trimmed = input.trim();
  if (!trimmed) {
    return {
      success: false,
      commands: [],
      errors: [createError('EMPTY_PROGRAM', 1, input, definition)],
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

    for (const { action, pattern, extract } of definition.patterns) {
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

    errors.push(detectErrorAt(input, position, definition));
    const nextPosition = skipToNextLine(input, position);

    if (nextPosition === position) {
      break;
    }

    position = nextPosition;
  }

  validateProgramStart(input, errors, definition);
  validateLineFormats(input, errors, definition);
  validateStructure(input, commands, errors, definition);
  validateFloorBounds(
    input,
    commands,
    options.referenceFloor ?? MIN_FLOOR,
    errors,
    definition,
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
      : filterRealtimeErrors(input, uniqueErrors, definition);

  return {
    success: filteredErrors.length === 0,
    commands,
    errors: filteredErrors,
  };
}
