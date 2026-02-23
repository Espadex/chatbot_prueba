# Git Workflow: Estándar GitFlow

Este documento define la estrategia de ramas y el flujo de trabajo basándose en el **modelo estándar GitFlow**, ideal para proyectos que tienen ciclos de liberación (releases) programados y necesitan mantener una versión de producción estable mientras se desarrolla la siguiente versión.

## 1. Estrategia de Ramas (Branching Strategy)

El repositorio se organiza alrededor de **dos ramas principales permanentes** y **tres tipos de ramas de soporte (efímeras)**.

### Ramas Principales (Permanentes)
1.  **`main` (o `master`)**: Es la fuente de la verdad para **PRODUCCIÓN**. Solo contiene código que ha sido liberado oficialmente. Cada fusión (merge) a esta rama siempre va acompañada de una etiqueta (Tag) con el número de versión (ej. `v1.0`, `v0.2`). **Nunca se programa directamente aquí.**
2.  **`develop`**: Es la rama de **INTEGRACIÓN**. Contiene el código más reciente entregado para la próxima versión (release). Es la rama base desde la que los desarrolladores inician su trabajo diario.

### Ramas de Soporte (Efímeras)
El formato estándar para nombrar ramas es: `<tipo>/<ticket>-<corta-descripcion>`

1.  **`feature/` (Nuevas Funcionalidades):**
    *   **Nace de:** `develop`
    *   **Se fusiona en:** `develop`
    *   *Uso:* Desarrollo de nuevas características (historias de usuario) para el próximo release. Solo existen en los entornos locales de los desarrolladores y se envían mediante PR a `develop`.
    *   *Ejemplo:* `feature/JIRA-123-login-modal`

2.  **`release/` (Entorno de QA y Preparación de Versión):**
    *   **Nace de:** `develop`
    *   **Se fusiona en:** `main` **Y** `develop`
    *   *Uso:* Esta rama **funciona como el entorno de QA (Pre-Producción)**. Se crea cuando `develop` ya tiene las características listas para la próxima versión. El equipo de QA asume el control de esta rama para hacer sus pruebas (regresión, funcionales, estrés).
        *   **Gestión de Bugs:** Si QA encuentra errores, los desarrolladores corrigen y hacen _commits_ de los arreglos (bugfixes) **directamente sobre esta rama `release/`**, sin volver a pasar por `develop` ni crear ramas `feature/`.
        *   Esto evita bloquear a otros desarrolladores que ya estén trabajando en `develop` para una versión futura. Una vez aprobada por QA, se fusiona hacia `main` (Producción) y de regreso a `develop` (para sincronizar los arreglos encontrados por QA).
    *   *Ejemplo:* `release/v1.0.0`

3.  **`hotfix/` (Correcciones Críticas en Producción):**
    *   **Nace de:** `main`
    *   **Se fusiona en:** `main` **Y** `develop`
    *   *Uso:* Se utilizan para resolver problemas urgentes (crash, bugs severos) detectados directamente en la versión en vivo (producción).
    *   *Ejemplo:* `hotfix/v1.0.1-crash-payment`

## 2. Mensajes de Commit (Conventional Commits)

Para automatizar la evolución del SemVer (ver [Política de Versionado](./VERSIONING_POLICY.md)) y la generación del changelog, es **obligatorio** usar convenciones en los mensajes.

**Estructura del Commit:**
`tipo(contexto-opcional): descripción corta en imperativo`

**Tipos Permitidos:**
*   `feat`: Funcionalidad nueva *(Aumenta MINOR al salir a release)*.
*   `fix`: Soluciona un error *(Aumenta PATCH)*.
*   `docs`: Cambios en la documentación.
*   `style`: Cambios de formato (no afecta el funcionamiento).
*   `refactor`: Reestructuración del código.
*   `test`: Modificar pruebas.
*   `chore`: Mantenimiento.

Si un cambio rompe la compatibilidad (aumentará la versión **MAJOR**), se agrega un `!` después del tipo (ej: `feat(api)!: cambiar autenticación`).

## 3. Flujo de Trabajo Diario (El "Tutorial")

Este es el paso a paso estándar que debes seguir cada vez que te asignen un nuevo ticket en tu día a día.

### Paso 1: Actualizar la rama de integración
Antes de iniciar, colócate en la rama `develop` (tu base) y tráete lo último que han subido tus compañeros.
```bash
git checkout develop
git pull origin develop
```

### Paso 2: Crear tu rama de feature
Crea tu rama a partir de `develop`.
```bash
git checkout -b feature/TKT-123-nueva-funcion
```

### Paso 3: Trabajar y hacer commits atómicos
Realiza cambios en tu código de la tarea. Haz commits pequeños.
```bash
git add .
git commit -m "feat(auth): agregar validación de email en el frontend"
```

### Paso 4: Mantente sincronizado (Evitar conflictos masivos)
Si tardas varios días, es probable que `develop` haya avanzado. Tráete esos cambios a tu rama para no tener una sorpresa final. Usa `rebase` para un historial limpio.
```bash
git fetch origin
git rebase origin/develop
```
*(Nota: Si hay conflictos, resuélvelos en tu editor, haz `git add .` y luego `git rebase --continue`).*

### Paso 5: Subir los cambios a la nube
```bash
git push -u origin feature/TKT-123-nueva-funcion
```

### Paso 6: Crear el Pull Request (PR)
Abre un Pull Request apuntando tu rama `feature/...` hacia la rama **`develop`** (NUNCA a `main`).

## 4. Reglas de Integración (Pull Requests y Merge)

1.  **Aprobaciones:** Todo PR debe tener al menos **1 o 2 aprobaciones** ("Approve") antes de poder hacer Merge.
2.  **CI Checks:** Las pruebas automatizadas (tests) y el pipeline deben pasar.
3.  **Merge de Features:** Utilizar **"Squash and Merge"** cuando se integre una `feature/` a `develop` para mantener el historial impecable.
4.  **Merge de Release/Hotfix:** Al cerrar estas ramas, recuerda que deben insertarse tanto en `main` (para crear el Tag de versión) como resolverse de vuelta en `develop` (para que los desarrolladores heredemos el hotfix/ajuste de release).
