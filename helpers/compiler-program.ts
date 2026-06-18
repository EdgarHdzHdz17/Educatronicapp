import type { CommandSoundKey } from '@/constants/audio';
import { MAX_FLOOR, MIN_FLOOR } from '@/constants/elevator';
import { playCommandSound } from '@/helpers/command-sounds';
import i18n from '@/i18n';
import {
  getParseErrorMessage,
  parseNaturalLanguage,
  type CommandAction,
  type CommandLanguage,
  type ParsedCommand,
} from '@/helpers/natural-language';

export type CompilerEventType =
  | 'status'
  | 'skip'
  | 'error'
  | 'complete'
  | 'cancelled';

export type CompilerEvent = {
  type: CompilerEventType;
  line?: number;
  message: string;
  floor?: number;
  targetFloor?: number;
  action?: CommandAction;
};

export type CompileProgramOptions = {
  code: string;
  referenceFloor: number;
  commandLanguage?: CommandLanguage;
  onEvent?: (event: CompilerEvent) => void;
  shouldContinue?: () => boolean;
  commandDelayMs?: number;
  soundDelayMs?: number;
};

export type CompileProgramResult = {
  success: boolean;
  events: CompilerEvent[];
  finalFloor: number;
};

const DEFAULT_COMMAND_DELAY_MS = 300;
const DEFAULT_SOUND_DELAY_MS = 550;

function wait(ms: number, shouldContinue?: () => boolean): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(shouldContinue?.() ?? true);
    }, ms);
  });
}

async function playActionSound(
  action: CommandAction,
  doorOpen: boolean,
): Promise<boolean> {
  if (action === 'OpenDoorCloseDoor') {
    if (doorOpen) {
      await playCommandSound('CloseDoor');
      return false;
    }

    await playCommandSound('OpenDoor');
    return true;
  }

  const soundByAction: Record<
    Exclude<CommandAction, 'OpenDoorCloseDoor'>,
    CommandSoundKey
  > = {
    StartElevator: 'StartElevator',
    EndElevator: 'EndElevator',
    UpLevelElevator: 'UpLevelElevator',
    DownLevelElevator: 'DownLevelElevator',
    StopElevator: 'StopElevator',
  };

  await playCommandSound(soundByAction[action]);
  return doorOpen;
}

function getSkipMessage(command: ParsedCommand, referenceFloor: number): string {
  if (command.action === 'StopElevator') {
    return `El elevador no se detiene: el comando P ${command.channel} es para el piso ${command.channel}, pero este elevador opera en el piso ${referenceFloor}.`;
  }

  return `No se mueven las puertas: el comando A ${command.channel} es para el piso ${command.channel}, pero este elevador opera en el piso ${referenceFloor}.`;
}

function getStatusMessage(
  command: ParsedCommand,
  currentFloor: number,
  referenceFloor: number,
  doorWillClose: boolean,
): string {
  switch (command.action) {
    case 'StartElevator':
      return `Iniciando el programa del elevador en el piso ${referenceFloor}.`;
    case 'EndElevator':
      return `Finalizando el programa. El elevador termina en el piso ${currentFloor}.`;
    case 'StopElevator':
      return `El elevador se detiene en el piso ${currentFloor}.`;
    case 'OpenDoorCloseDoor':
      return doorWillClose
        ? `Cerrando las puertas en el piso ${currentFloor}.`
        : `Abriendo las puertas en el piso ${currentFloor}.`;
    default:
      return 'Ejecutando comando...';
  }
}

function getUpStepMessage(fromFloor: number, toFloor: number): string {
  return `El elevador está subiendo del piso ${fromFloor} al piso ${toFloor}.`;
}

function getDownStepMessage(fromFloor: number, toFloor: number): string {
  return `El elevador está bajando del piso ${fromFloor} al piso ${toFloor}.`;
}

async function executeVerticalMove(
  command: ParsedCommand,
  context: {
    currentFloor: number;
    doorOpen: boolean;
    emit: (event: CompilerEvent) => void;
    shouldContinue?: () => boolean;
    soundDelayMs: number;
  },
): Promise<{ currentFloor: number; doorOpen: boolean; success: boolean }> {
  const { emit, shouldContinue, soundDelayMs } = context;
  let { currentFloor, doorOpen } = context;

  const steps = command.level;
  if (steps === undefined || steps < 1) {
    return { currentFloor, doorOpen, success: true };
  }

  const direction = command.action === 'UpLevelElevator' ? 'up' : 'down';
  const action: CommandAction =
    direction === 'up' ? 'UpLevelElevator' : 'DownLevelElevator';
  const step = direction === 'up' ? 1 : -1;
  const getStepMessage =
    direction === 'up' ? getUpStepMessage : getDownStepMessage;

  for (let moveIndex = 0; moveIndex < steps; moveIndex += 1) {
    const nextFloor = currentFloor + step;

    if (nextFloor < MIN_FLOOR) {
      emit({
        type: 'skip',
        line: command.line,
        action: command.action,
        floor: currentFloor,
        message: `No puede bajar más: el elevador ya está en el piso ${MIN_FLOOR}.`,
      });
      break;
    }

    if (nextFloor > MAX_FLOOR) {
      emit({
        type: 'skip',
        line: command.line,
        action: command.action,
        floor: currentFloor,
        message: `No puede subir más: el elevador ya está en el piso ${MAX_FLOOR}.`,
      });
      break;
    }

    emit({
      type: 'status',
      line: command.line,
      action,
      floor: nextFloor,
      message: getStepMessage(currentFloor, nextFloor),
    });

    doorOpen = await playActionSound(action, doorOpen);

    const canContinue = await wait(soundDelayMs, shouldContinue);
    if (!canContinue) {
      return { currentFloor, doorOpen, success: false };
    }

    currentFloor = nextFloor;
  }

  return { currentFloor, doorOpen, success: true };
}

async function executeCommand(
  command: ParsedCommand,
  context: {
    referenceFloor: number;
    currentFloor: number;
    doorOpen: boolean;
    emit: (event: CompilerEvent) => void;
    shouldContinue?: () => boolean;
    soundDelayMs: number;
  },
): Promise<{ currentFloor: number; doorOpen: boolean; success: boolean }> {
  const { referenceFloor, emit, shouldContinue, soundDelayMs } = context;
  let { currentFloor, doorOpen } = context;

  const isFloorSpecificCommand =
    command.action === 'StopElevator' ||
    command.action === 'OpenDoorCloseDoor';

  if (isFloorSpecificCommand && command.channel !== referenceFloor) {
    emit({
      type: 'skip',
      line: command.line,
      action: command.action,
      floor: currentFloor,
      message: getSkipMessage(command, referenceFloor),
    });
    return { currentFloor, doorOpen, success: true };
  }

  if (
    command.action === 'UpLevelElevator' ||
    command.action === 'DownLevelElevator'
  ) {
    return executeVerticalMove(command, {
      currentFloor,
      doorOpen,
      emit,
      shouldContinue,
      soundDelayMs,
    });
  }

  const doorWillClose =
    command.action === 'OpenDoorCloseDoor' ? doorOpen : doorOpen;

  emit({
    type: 'status',
    line: command.line,
    action: command.action,
    floor: currentFloor,
    message: getStatusMessage(command, currentFloor, referenceFloor, doorWillClose),
  });

  doorOpen = await playActionSound(command.action, doorOpen);

  const canContinue = await wait(soundDelayMs, shouldContinue);
  if (!canContinue) {
    return { currentFloor, doorOpen, success: false };
  }

  return { currentFloor, doorOpen, success: true };
}

async function returnToHomeFloor(context: {
  currentFloor: number;
  doorOpen: boolean;
  emit: (event: CompilerEvent) => void;
  shouldContinue?: () => boolean;
  commandDelayMs: number;
  soundDelayMs: number;
}): Promise<{ currentFloor: number; doorOpen: boolean; success: boolean }> {
  const { emit, shouldContinue, commandDelayMs, soundDelayMs } = context;
  let { currentFloor, doorOpen } = context;

  if (currentFloor <= MIN_FLOOR) {
    return { currentFloor, doorOpen, success: true };
  }

  emit({
    type: 'status',
    floor: currentFloor,
    message: 'Regresando al piso 1, un piso a la vez.',
  });

  while (currentFloor > MIN_FLOOR) {
    if (shouldContinue && !shouldContinue()) {
      return { currentFloor, doorOpen, success: false };
    }

    const nextFloor = currentFloor - 1;

    emit({
      type: 'status',
      action: 'DownLevelElevator',
      floor: nextFloor,
      message: getDownStepMessage(currentFloor, nextFloor),
    });

    doorOpen = await playActionSound('DownLevelElevator', doorOpen);

    const canContinueSound = await wait(soundDelayMs, shouldContinue);
    if (!canContinueSound) {
      return { currentFloor, doorOpen, success: false };
    }

    currentFloor = nextFloor;

    const canContinueCommand = await wait(commandDelayMs, shouldContinue);
    if (!canContinueCommand) {
      return { currentFloor, doorOpen, success: false };
    }
  }

  return { currentFloor, doorOpen, success: true };
}

export async function compileProgram(
  options: CompileProgramOptions,
): Promise<CompileProgramResult> {
  const {
    code,
    referenceFloor,
    commandLanguage,
    onEvent,
    shouldContinue,
    commandDelayMs = DEFAULT_COMMAND_DELAY_MS,
    soundDelayMs = DEFAULT_SOUND_DELAY_MS,
  } = options;

  const events: CompilerEvent[] = [];
  const emit = (event: CompilerEvent) => {
    events.push(event);
    onEvent?.(event);
  };

  const parseResult = parseNaturalLanguage(code, {
    realtime: false,
    referenceFloor,
    commandLanguage,
  });

  if (!parseResult.success) {
    const firstError = parseResult.errors[0];
    emit({
      type: 'error',
      line: firstError?.line,
      message: firstError
        ? getParseErrorMessage(firstError, commandLanguage ?? 'es')
        : i18n.t('coding.compileErrors'),
    });

    return {
      success: false,
      events,
      finalFloor: referenceFloor,
    };
  }

  if (parseResult.commands.length === 0) {
    emit({
      type: 'error',
      message: 'No hay instrucciones para ejecutar.',
    });

    return {
      success: false,
      events,
      finalFloor: referenceFloor,
    };
  }

  let currentFloor = referenceFloor;
  let doorOpen = false;

  emit({
    type: 'status',
    floor: referenceFloor,
    message: `El elevador inicia en el piso ${referenceFloor} (según el picker).`,
  });

  for (const command of parseResult.commands) {
    if (shouldContinue && !shouldContinue()) {
      emit({
        type: 'cancelled',
        floor: currentFloor,
        message: 'Ejecución detenida por el usuario.',
      });

      return {
        success: false,
        events,
        finalFloor: currentFloor,
      };
    }

    const result = await executeCommand(command, {
      referenceFloor,
      currentFloor,
      doorOpen,
      emit,
      shouldContinue,
      soundDelayMs,
    });

    if (!result.success) {
      emit({
        type: 'cancelled',
        floor: currentFloor,
        message: 'Ejecución detenida por el usuario.',
      });

      return {
        success: false,
        events,
        finalFloor: currentFloor,
      };
    }

    currentFloor = result.currentFloor;
    doorOpen = result.doorOpen;

    const canContinue = await wait(commandDelayMs, shouldContinue);
    if (!canContinue) {
      emit({
        type: 'cancelled',
        floor: currentFloor,
        message: 'Ejecución detenida por el usuario.',
      });

      return {
        success: false,
        events,
        finalFloor: currentFloor,
      };
    }
  }

  const homeResult = await returnToHomeFloor({
    currentFloor,
    doorOpen,
    emit,
    shouldContinue,
    commandDelayMs,
    soundDelayMs,
  });

  if (!homeResult.success) {
    emit({
      type: 'cancelled',
      floor: homeResult.currentFloor,
      message: 'Ejecución detenida por el usuario.',
    });

    return {
      success: false,
      events,
      finalFloor: homeResult.currentFloor,
    };
  }

  currentFloor = homeResult.currentFloor;
  doorOpen = homeResult.doorOpen;

  emit({
    type: 'complete',
    floor: currentFloor,
    message: `Programa finalizado. El elevador regresó al piso ${currentFloor}.`,
  });

  return {
    success: true,
    events,
    finalFloor: currentFloor,
  };
}
