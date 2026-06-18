import type { CommandSoundKey } from '@/constants/audio';
import { playCommandSound } from '@/helpers/command-sounds';
import {
  parseNaturalLanguage,
  type CommandAction,
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
    case 'UpLevelElevator':
      return `El elevador está subiendo del piso ${currentFloor} al piso ${command.level}.`;
    case 'DownLevelElevator':
      return `El elevador está bajando del piso ${currentFloor} al piso ${command.level}.`;
    case 'StopElevator':
      return `El elevador se detiene en el piso ${referenceFloor}.`;
    case 'OpenDoorCloseDoor':
      return doorWillClose
        ? `Cerrando las puertas en el piso ${referenceFloor}.`
        : `Abriendo las puertas en el piso ${referenceFloor}.`;
    default:
      return 'Ejecutando comando...';
  }
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

  const doorWillClose =
    command.action === 'OpenDoorCloseDoor' ? doorOpen : doorOpen;

  emit({
    type: 'status',
    line: command.line,
    action: command.action,
    floor: currentFloor,
    targetFloor:
      command.action === 'UpLevelElevator' ||
      command.action === 'DownLevelElevator'
        ? command.level
        : undefined,
    message: getStatusMessage(
      command,
      currentFloor,
      referenceFloor,
      doorWillClose,
    ),
  });

  doorOpen = await playActionSound(command.action, doorOpen);

  const canContinue = await wait(soundDelayMs, shouldContinue);
  if (!canContinue) {
    return { currentFloor, doorOpen, success: false };
  }

  if (command.action === 'UpLevelElevator' && command.level !== undefined) {
    currentFloor = command.level;
  }

  if (command.action === 'DownLevelElevator' && command.level !== undefined) {
    currentFloor = command.level;
  }

  return { currentFloor, doorOpen, success: true };
}

export async function compileProgram(
  options: CompileProgramOptions,
): Promise<CompileProgramResult> {
  const {
    code,
    referenceFloor,
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

  const parseResult = parseNaturalLanguage(code, { realtime: false });

  if (!parseResult.success) {
    const firstError = parseResult.errors[0];
    emit({
      type: 'error',
      line: firstError?.line,
      message: firstError?.message ?? 'El programa tiene errores y no puede ejecutarse.',
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
    message: `El elevador está en el piso ${referenceFloor}. Preparando ejecución del programa...`,
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

  emit({
    type: 'complete',
    floor: currentFloor,
    message: `Programa finalizado. El elevador quedó en el piso ${currentFloor}.`,
  });

  return {
    success: true,
    events,
    finalFloor: currentFloor,
  };
}
