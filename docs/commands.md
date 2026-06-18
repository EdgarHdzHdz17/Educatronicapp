# Commands / Comandos

Documentation for the Educatronic programming language: text commands, regular expressions, and DTMF identifiers.

Documentación del lenguaje de programación Educatronicapp: comandos de texto, expresiones regulares e identificadores DTMF.

- [English](#english)
- [Español](#español)

---

## English

This document defines the actions available in the Educatronic programming language, their text commands, the regular expressions used to recognize them, and the DTMF identifiers associated with each action.

### Action summary

| Action     | Command  | Regular expression (pattern) | DTMF identifier     |
| ---------- | -------- | ---------------------------- | ------------------- |
| Start      | `I`, `i` | `\s*[Ii]\n+`                 | `dtmf_12`           |
| End        | `F`, `f` | `\s*[Ff]\n*`                 | `dtmf_d`            |
| Up         | `S`, `s` | `\s*[Ss]\s+[1-6]\n+`         | `dtmf_2`            |
| Down       | `B`, `b` | `\s*[Bb]\s+[1-6]\n+`         | `dtmf_1`            |
| Stop       | `P`, `p` | `\s*[Pp]\s+[1-9]\n+`         | `dtmf_3`            |
| Open-Close | `A`, `a` | `\s*[Aa]\s+[1-9]\n+`         | `dtmf_8` – `dtmf_4` |

### Action details

#### Start (`I` / `i`)

Marks the beginning of a program or instruction block.

- **Command:** letter `I` or `i` (uppercase or lowercase).
- **Pattern:** optional leading whitespace, followed by `I` or `i`, and at least one newline.
- **DTMF:** `dtmf_12` → audio file `assets/audio/dtmf_12.wav`.

**Valid example:**

```
I
```

#### End (`F` / `f`)

Marks the end of a program or instruction block.

- **Command:** letter `F` or `f`.
- **Pattern:** optional leading whitespace, followed by `F` or `f`, and zero or more newlines.
- **DTMF:** `dtmf_d` → audio file `assets/audio/dtmf_d.wav`.

**Valid example:**

```
F
```

#### Up (`S` / `s`)

Activates upward movement at a given level.

- **Command:** letter `S` or `s`, followed by a space and a number from **1 to 6** (level).
- **Pattern:** optional leading whitespace, `S` or `s`, one or more spaces, digit `1`–`6`, and at least one newline.
- **DTMF:** `dtmf_2` → audio file `assets/audio/dtmf_2.wav`.

**Valid example:**

```
S 3
```

#### Down (`B` / `b`)

Activates downward movement at a given level.

- **Command:** letter `B` or `b`, followed by a space and a number from **1 to 6** (level).
- **Pattern:** optional leading whitespace, `B` or `b`, one or more spaces, digit `1`–`6`, and at least one newline.
- **DTMF:** `dtmf_1` → audio file `assets/audio/dtmf_1.wav`.

**Valid example:**

```
B 2
```

#### Stop (`P` / `p`)

Stops movement on the specified device or channel.

- **Command:** letter `P` or `p`, followed by a space and a number from **1 to 9**.
- **Pattern:** optional leading whitespace, `P` or `p`, one or more spaces, digit `1`–`9`, and at least one newline.
- **DTMF:** `dtmf_3` → audio file `assets/audio/dtmf_3.wav`.

**Valid example:**

```
P 5
```

#### Open-Close (`A` / `a`)

Controls opening or closing a mechanism on the specified channel.

- **Command:** letter `A` or `a`, followed by a space and a number from **1 to 9**.
- **Pattern:** optional leading whitespace, `A` or `a`, one or more spaces, digit `1`–`9`, and at least one newline.
- **DTMF:**
  - `dtmf_8` → open (`assets/audio/dtmf_8.wav`)
  - `dtmf_4` → close (`assets/audio/dtmf_4.wav`)

**Valid example:**

```
A 7
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
| `[Ii]`  | Character `I` or `i`               |
| `[1-6]` | Digit from 1 to 6                  |
| `[1-9]` | Digit from 1 to 9                  |

Commands are case-insensitive for the action letter (`I`/`i`, `F`/`f`, etc.).

### DTMF identifiers

Each action is associated with a DTMF tone that the app plays during simulation or execution. The corresponding audio files are located in `assets/audio/`.

| Identifier | File          | Associated action  |
| ---------- | ------------- | ------------------ |
| `dtmf_12`  | `dtmf_12.wav` | Start              |
| `dtmf_d`   | `dtmf_d.wav`  | End                |
| `dtmf_2`   | `dtmf_2.wav`  | Up                 |
| `dtmf_1`   | `dtmf_1.wav`  | Down               |
| `dtmf_3`   | `dtmf_3.wav`  | Stop               |
| `dtmf_8`   | `dtmf_8.wav`  | Open (Open-Close)  |
| `dtmf_4`   | `dtmf_4.wav`  | Close (Open-Close) |

---

## Español

Este documento define las acciones disponibles en el lenguaje de programación Educatronic, sus comandos de texto, las expresiones regulares para reconocerlos y los identificadores DTMF asociados a cada acción.

### Resumen de acciones

| Acción       | Comando  | Expresión regular (patrón) | Identificador DTMF  |
| ------------ | -------- | -------------------------- | ------------------- |
| Inicio       | `I`, `i` | `\s*[Ii]\n+`               | `dtmf_12`           |
| Fin          | `F`, `f` | `\s*[Ff]\n*`               | `dtmf_d`            |
| Subir        | `S`, `s` | `\s*[Ss]\s+[1-6]\n+`       | `dtmf_2`            |
| Bajar        | `B`, `b` | `\s*[Bb]\s+[1-6]\n+`       | `dtmf_1`            |
| Parar        | `P`, `p` | `\s*[Pp]\s+[1-9]\n+`       | `dtmf_3`            |
| Abrir-Cerrar | `A`, `a` | `\s*[Aa]\s+[1-9]\n+`       | `dtmf_8` – `dtmf_4` |

### Descripción de cada acción

#### Inicio (`I` / `i`)

Marca el inicio de un programa o bloque de instrucciones.

- **Comando:** letra `I` o `i` (mayúscula o minúscula).
- **Patrón:** espacios en blanco opcionales al inicio, seguidos de `I` o `i`, y al menos un salto de línea.
- **DTMF:** `dtmf_12` → archivo de audio `assets/audio/dtmf_12.wav`.

**Ejemplo válido:**

```
I
```

#### Fin (`F` / `f`)

Marca el final de un programa o bloque de instrucciones.

- **Comando:** letra `F` o `f`.
- **Patrón:** espacios en blanco opcionales al inicio, seguidos de `F` o `f`, y cero o más saltos de línea.
- **DTMF:** `dtmf_d` → archivo de audio `assets/audio/dtmf_d.wav`.

**Ejemplo válido:**

```
F
```

#### Subir (`S` / `s`)

Activa el movimiento ascendente en un nivel determinado.

- **Comando:** letra `S` o `s`, seguida de un espacio y un número del **1 al 6** (nivel).
- **Patrón:** espacios opcionales al inicio, `S` o `s`, uno o más espacios, dígito `1`–`6`, y al menos un salto de línea.
- **DTMF:** `dtmf_2` → archivo de audio `assets/audio/dtmf_2.wav`.

**Ejemplo válido:**

```
S 3
```

#### Bajar (`B` / `b`)

Activa el movimiento descendente en un nivel determinado.

- **Comando:** letra `B` o `b`, seguida de un espacio y un número del **1 al 6** (nivel).
- **Patrón:** espacios opcionales al inicio, `B` o `b`, uno o más espacios, dígito `1`–`6`, y al menos un salto de línea.
- **DTMF:** `dtmf_1` → archivo de audio `assets/audio/dtmf_1.wav`.

**Ejemplo válido:**

```
B 2
```

#### Parar (`P` / `p`)

Detiene el movimiento en un dispositivo o canal indicado.

- **Comando:** letra `P` o `p`, seguida de un espacio y un número del **1 al 9**.
- **Patrón:** espacios opcionales al inicio, `P` o `p`, uno o más espacios, dígito `1`–`9`, y al menos un salto de línea.
- **DTMF:** `dtmf_3` → archivo de audio `assets/audio/dtmf_3.wav`.

**Ejemplo válido:**

```
P 5
```

#### Abrir-Cerrar (`A` / `a`)

Controla la apertura o el cierre de un mecanismo en un canal indicado.

- **Comando:** letra `A` o `a`, seguida de un espacio y un número del **1 al 9**.
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
| `[1-6]` | Dígito del 1 al 6                             |
| `[1-9]` | Dígito del 1 al 9                             |

Los comandos no distinguen entre mayúsculas y minúsculas en la letra de acción (`I`/`i`, `F`/`f`, etc.).

### Identificadores DTMF

Cada acción se asocia a un tono DTMF que la app reproduce durante la simulación o ejecución. Los archivos de audio correspondientes se encuentran en `assets/audio/`.

| Identificador | Archivo       | Acción asociada       |
| ------------- | ------------- | --------------------- |
| `dtmf_12`     | `dtmf_12.wav` | Inicio                |
| `dtmf_d`      | `dtmf_d.wav`  | Fin                   |
| `dtmf_2`      | `dtmf_2.wav`  | Subir                 |
| `dtmf_1`      | `dtmf_1.wav`  | Bajar                 |
| `dtmf_3`      | `dtmf_3.wav`  | Parar                 |
| `dtmf_8`      | `dtmf_8.wav`  | Abrir (Abrir-Cerrar)  |
| `dtmf_4`      | `dtmf_4.wav`  | Cerrar (Abrir-Cerrar) |
