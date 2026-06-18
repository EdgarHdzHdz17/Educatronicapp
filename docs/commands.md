# Commands / Comandos

Documentation for the Educatronic programming language: text commands, regular expressions, and DTMF identifiers.

Documentación del lenguaje de programación Educatronicapp: comandos de texto, expresiones regulares e identificadores DTMF.

- [English](#english)
- [Español](#español)

---

## English

This document defines the actions available in the Educatronic programming language, their text commands, the regular expressions used to recognize them, and the DTMF identifiers associated with each action.

### Action summary

English commands use the initial letter of each action word (**S**tart, **E**nd, **U**p, **D**own, **P**ause/**S**top, **O**pen).

| Action             | Command  | Regular expression (pattern) | DTMF identifier     |
| ------------------ | -------- | ---------------------------- | ------------------- |
| StartElevator      | `S`, `s` | `\s*[Ss]\s*\n+`              | `dtmf_12`           |
| EndElevator        | `E`, `e` | `\s*[Ee]\n*`                 | `dtmf_d`            |
| UpLevelElevator    | `U`, `u` | `\s*[Uu]\s+[1-6]\n+`         | `dtmf_2`            |
| DownLevelElevator  | `D`, `d` | `\s*[Dd]\s+[1-6]\n+`         | `dtmf_1`            |
| StopElevator       | `P`, `p` | `\s*[Pp]\s+[1-9]\n+`         | `dtmf_3`            |
| OpenDoor-CloseDoor | `O`, `o` | `\s*[Oo]\s+[1-9]\n+`         | `dtmf_8` – `dtmf_4` |

### Action details

#### StartElevator (`S` / `s`)

Marks the beginning of a program or instruction block.

- **Command:** letter `S` or `s` (**S**tart; uppercase or lowercase).
- **Pattern:** optional leading whitespace, followed by `S` or `s`, and at least one newline.
- **DTMF:** `dtmf_12` → audio file `assets/audio/dtmf_12.wav`.

**Valid example:**

```
S
```

#### EndElevator (`E` / `e`)

Marks the end of a program or instruction block.

- **Command:** letter `E` or `e` (**E**nd).
- **Pattern:** optional leading whitespace, followed by `E` or `e`, and zero or more newlines.
- **DTMF:** `dtmf_d` → audio file `assets/audio/dtmf_d.wav`.

**Valid example:**

```
E
```

#### UpLevelElevator (`U` / `u`)

Activates upward movement at a given level.

- **Command:** letter `U` or `u` (**U**p), followed by a space and a number from **1 to 6** (level).
- **Pattern:** optional leading whitespace, `U` or `u`, one or more spaces, digit `1`–`6`, and at least one newline.
- **DTMF:** `dtmf_2` → audio file `assets/audio/dtmf_2.wav`.

**Valid example:**

```
U 3
```

#### DownLevelElevator (`D` / `d`)

Activates downward movement at a given level.

- **Command:** letter `D` or `d` (**D**own), followed by a space and a number from **1 to 6** (level).
- **Pattern:** optional leading whitespace, `D` or `d`, one or more spaces, digit `1`–`6`, and at least one newline.
- **DTMF:** `dtmf_1` → audio file `assets/audio/dtmf_1.wav`.

**Valid example:**

```
D 2
```

#### StopElevator (`P` / `p`)

Stops movement on the specified device or channel.

- **Command:** letter `P` or `p` (**P**ause/**S**top), followed by a space and a number from **1 to 9**. Letter `P` is used instead of `S` to avoid conflict with **S**tart.
- **Pattern:** optional leading whitespace, `P` or `p`, one or more spaces, digit `1`–`9`, and at least one newline.
- **DTMF:** `dtmf_3` → audio file `assets/audio/dtmf_3.wav`.

**Valid example:**

```
P 5
```

#### OpenDoor-CloseDoor (`O` / `o`)

Controls opening or closing a mechanism on the specified channel.

- **Command:** letter `O` or `o` (**O**pen), followed by a space and a number from **1 to 9**.
- **Pattern:** optional leading whitespace, `O` or `o`, one or more spaces, digit `1`–`9`, and at least one newline.
- **DTMF:**
  - `dtmf_8` → open (`assets/audio/dtmf_8.wav`)
  - `dtmf_4` → close (`assets/audio/dtmf_4.wav`)

**Valid example:**

```
O 7
```

### Regular expression notes

| Symbol  | Meaning                            |
| ------- | ---------------------------------- |
| `\s`    | Whitespace (space, tab, etc.)      |
| `\s*`   | Zero or more whitespace characters |
| `\s+`   | One or more whitespace characters  |
| `\n`    | Newline                            |
| `\n+`   | One or more newlines               |
| `\n*`   | Zero or more newlines              |
| `[Ss]`  | Character `S` or `s`               |
| `[Ee]`  | Character `E` or `e`               |
| `[Uu]`  | Character `U` or `u`               |
| `[Dd]`  | Character `D` or `d`               |
| `[Pp]`  | Character `P` or `p`               |
| `[Oo]`  | Character `O` or `o`               |
| `[1-6]` | Digit from 1 to 6                  |
| `[1-9]` | Digit from 1 to 9                  |

Commands are case-insensitive for the action letter (`S`/`s`, `E`/`e`, etc.).

### DTMF identifiers

Each action is associated with a DTMF tone that the app plays during simulation or execution. The corresponding audio files are located in `assets/audio/`.

| Identifier | File          | Associated action        |
| ---------- | ------------- | ------------------------ |
| `dtmf_12`  | `dtmf_12.wav` | StartElevator            |
| `dtmf_d`   | `dtmf_d.wav`  | EndElevator              |
| `dtmf_2`   | `dtmf_2.wav`  | UpLevelElevator          |
| `dtmf_1`   | `dtmf_1.wav`  | DownLevelElevator        |
| `dtmf_3`   | `dtmf_3.wav`  | StopElevator             |
| `dtmf_8`   | `dtmf_8.wav`  | Open (OpenDoor-CloseDoor) |
| `dtmf_4`   | `dtmf_4.wav`  | Close (OpenDoor-CloseDoor) |

---

## Español

Este documento define las acciones disponibles en el lenguaje de programación Educatronic, sus comandos de texto, las expresiones regulares para reconocerlos y los identificadores DTMF asociados a cada acción.

### Resumen de acciones

Los comandos en español usan la letra inicial de cada palabra de acción (**I**nicio, **F**in, **S**ubir, **B**ajar, **P**arar, **A**brir).

| Acción                    | Comando  | Expresión regular (patrón) | Identificador DTMF  |
| ------------------------- | -------- | -------------------------- | ------------------- |
| InicioElevador            | `I`, `i` | `\s*[Ii]\s*\n+`            | `dtmf_12`           |
| FinElevador               | `F`, `f` | `\s*[Ff]\n*`               | `dtmf_d`            |
| SubirNivelElevador        | `S`, `s` | `\s*[Ss]\s+[1-6]\n+`       | `dtmf_2`            |
| BajarNivelElevador        | `B`, `b` | `\s*[Bb]\s+[1-6]\n+`       | `dtmf_1`            |
| PararElevador             | `P`, `p` | `\s*[Pp]\s+[1-9]\n+`       | `dtmf_3`            |
| AbrirPuerta-CerrarPuerta  | `A`, `a` | `\s*[Aa]\s+[1-9]\n+`       | `dtmf_8` – `dtmf_4` |

### Descripción de cada acción

#### InicioElevador (`I` / `i`)

Marca el inicio de un programa o bloque de instrucciones.

- **Comando:** letra `I` o `i` (**I**nicio; mayúscula o minúscula).
- **Patrón:** espacios en blanco opcionales al inicio, seguidos de `I` o `i`, espacios opcionales y al menos un salto de línea.
- **DTMF:** `dtmf_12` → archivo de audio `assets/audio/dtmf_12.wav`.

**Ejemplo válido:**

```
I
```

#### FinElevador (`F` / `f`)

Marca el final de un programa o bloque de instrucciones.

- **Comando:** letra `F` o `f` (**F**in).
- **Patrón:** espacios en blanco opcionales al inicio, seguidos de `F` o `f`, y cero o más saltos de línea.
- **DTMF:** `dtmf_d` → archivo de audio `assets/audio/dtmf_d.wav`.

**Ejemplo válido:**

```
F
```

#### SubirNivelElevador (`S` / `s`)

Activa el movimiento ascendente en un nivel determinado.

- **Comando:** letra `S` o `s` (**S**ubir), seguida de un espacio y un número del **1 al 6** (nivel).
- **Patrón:** espacios opcionales al inicio, `S` o `s`, uno o más espacios, dígito `1`–`6`, y al menos un salto de línea.
- **DTMF:** `dtmf_2` → archivo de audio `assets/audio/dtmf_2.wav`.

**Ejemplo válido:**

```
S 3
```

#### BajarNivelElevador (`B` / `b`)

Activa el movimiento descendente en un nivel determinado.

- **Comando:** letra `B` o `b` (**B**ajar), seguida de un espacio y un número del **1 al 6** (nivel).
- **Patrón:** espacios opcionales al inicio, `B` o `b`, uno o más espacios, dígito `1`–`6`, y al menos un salto de línea.
- **DTMF:** `dtmf_1` → archivo de audio `assets/audio/dtmf_1.wav`.

**Ejemplo válido:**

```
B 2
```

#### PararElevador (`P` / `p`)

Detiene el movimiento en un dispositivo o canal indicado.

- **Comando:** letra `P` o `p` (**P**arar), seguida de un espacio y un número del **1 al 9**.
- **Patrón:** espacios opcionales al inicio, `P` o `p`, uno o más espacios, dígito `1`–`9`, y al menos un salto de línea.
- **DTMF:** `dtmf_3` → archivo de audio `assets/audio/dtmf_3.wav`.

**Ejemplo válido:**

```
P 5
```

#### AbrirPuerta-CerrarPuerta (`A` / `a`)

Controla la apertura o el cierre de un mecanismo en un canal indicado.

- **Comando:** letra `A` o `a` (**A**brir), seguida de un espacio y un número del **1 al 9**.
- **Patrón:** espacios opcionales al inicio, `A` o `a`, uno o más espacios, dígito `1`–`9`, y al menos un salto de línea.
- **DTMF:**
  - `dtmf_8` → abrir (`assets/audio/dtmf_8.wav`)
  - `dtmf_4` → cerrar (`assets/audio/dtmf_4.wav`)

**Ejemplo válido:**

```
A 7
```

### Notas sobre las expresiones regulares

| Símbolo | Significado                                   |
| ------- | --------------------------------------------- |
| `\s`    | Espacio en blanco (espacio, tabulación, etc.) |
| `\s*`   | Cero o más espacios en blanco                 |
| `\s+`   | Uno o más espacios en blanco                  |
| `\n`    | Salto de línea                                |
| `\n+`   | Uno o más saltos de línea                     |
| `\n*`   | Cero o más saltos de línea                    |
| `[Ii]`  | Carácter `I` o `i`                            |
| `[Ff]`  | Carácter `F` o `f`                            |
| `[Ss]`  | Carácter `S` o `s`                            |
| `[Bb]`  | Carácter `B` o `b`                            |
| `[Pp]`  | Carácter `P` o `p`                            |
| `[Aa]`  | Carácter `A` o `a`                            |
| `[1-6]` | Dígito del 1 al 6                             |
| `[1-9]` | Dígito del 1 al 9                             |

Los comandos no distinguen entre mayúsculas y minúsculas en la letra de acción (`I`/`i`, `F`/`f`, `S`/`s`, etc.).

### Identificadores DTMF

Cada acción se asocia a un tono DTMF que la app reproduce durante la simulación o ejecución. Los archivos de audio correspondientes se encuentran en `assets/audio/`.

| Identificador | Archivo       | Acción asociada                      |
| ------------- | ------------- | ------------------------------------ |
| `dtmf_12`     | `dtmf_12.wav` | InicioElevador                       |
| `dtmf_d`      | `dtmf_d.wav`  | FinElevador                          |
| `dtmf_2`      | `dtmf_2.wav`  | SubirNivelElevador                   |
| `dtmf_1`      | `dtmf_1.wav`  | BajarNivelElevador                   |
| `dtmf_3`      | `dtmf_3.wav`  | PararElevador                        |
| `dtmf_8`      | `dtmf_8.wav`  | Abrir (AbrirPuerta-CerrarPuerta)     |
| `dtmf_4`      | `dtmf_4.wav`  | Cerrar (AbrirPuerta-CerrarPuerta)    |
