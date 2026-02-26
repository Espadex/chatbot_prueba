# Git Workflow: Estándar GitFlow

Este documento define la estrategia de ramas y el flujo de trabajo basándose en el **[modelo estándar GitFlow documentado por Atlassian](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)**, ampliamente adoptado en la industria. Es ideal para proyectos que tienen ciclos de liberación (releases) programados y necesitan mantener una versión de producción estable mientras se desarrolla la siguiente versión.


El repositorio se organiza alrededor de **dos ramas principales permanentes** y **tres tipos de ramas de soporte (efímeras)**.

### Ramas Principales (Permanentes)
1.  **`main` (o `master`)**: Es la fuente de la verdad para **PRODUCCIÓN**. Solo contiene código que ha sido liberado oficialmente. Cada fusión (merge) a esta rama siempre va acompañada de una etiqueta (Tag) con el número de versión (ej. `v1.0`, `v0.2`). **Nunca se programa directamente aquí.**
2.  **`develop`**: Es la rama de **INTEGRACIÓN**. Contiene el código más reciente entregado para la próxima versión (release). Es la rama base desde la que los desarrolladores inician su trabajo diario.

### Ramas de Soporte (Efímeras)
El formato estándar para nombrar ramas es: `<tipo>/<ticket>-<corta-descripcion>`

1.  **`feature/` (Nuevas Funcionalidades):**
    *   **Nace de:** `develop`
    *   **Se fusiona en:** `develop`
    *   *Uso:* Desarrollo de nuevas características (historias de usuario) para el próximo release. Local o empujado para PR.
    *   *🛑 Regla de Limpieza Obligatoria:* Una vez que el Pull Request hacia `develop` es aprobado y fusionado (Merged), **LA RAMA DEBE SER ELIMINADA INMEDIATAMENTE** en el repositorio remoto. ¡Prohibido acumular ramas muertas o de funcionalidades ya cerradas!
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

Para que una rama sea aceptada en el repositorio remoto, es **obligatorio** someterse a un riguroso proceso de revisión cruzada. El flujo tipo "Pipelines libres directos a main" queda obsoleto bajo estas reglas.

### Sistema de Aprobaciones (Code Review)
1.  **Mínimo de Revisores:** Todo PR (indistintamente si va dirigido a `develop` o a `main`) requiere obligatoriamente **al menos 2 aprobaciones ("Approve")** de otros desarrolladores antes de habilitarse el botón de Merge.
2.  **Prohibición de Auto-aprobación:** El creador del Pull Request jamás podrá auto-aprobarse su código. Queda rotundamente prohibido hacer _bypassing_ (saltarse) el flujo de revisión.
3.  **Code Owners:** En proyectos modulares, si un PR toca código sensible (ej., configuraciones de red, autenticación principal, esquemas de BD), se requerirá la aprobación explícita de un *Tech Lead* o un *Arquitecto* designado (Code Owner del módulo).
4.  **Resolución de Comentarios ("Changes Requested"):** Si un revisor marca el PR con un estado de "Solicitud de Cambios", el PR queda **bloqueado**. El desarrollador debe hacer nuevos commits respondiendo a los requerimientos y solicitar de nuevo la revisión para remover el bloqueo. No se puede fusionar un PR con comentarios (hilos de charla) o debates sin resolver.

### Filtros Automáticos (CI Checks)
1.  **Pipeline en Verde:** Las pruebas automatizadas (Unit tests y E2E), el análisis de calidad de código (SonarQube o Linters) y la construcción (Build) deben reportar un estado "Success". Un PR fallando en CI jamás será integrado.

### Estrategias de Fusión (Merge Strategies)
1.  **Merge de Features:** Se deberá utilizar de forma estricta **"Squash and Merge"** cuando se integre una `feature/` a `develop`. Esto comprime la suciedad del historial (ej., commits tipo "test1", "fix bug rápido") en un solo commit semántico y limpio.
2.  **Merge de Release/Hotfix:** Estas ramas utilizan _Merge Commits_ estándar (no Squash) debido a que deben integrarse íntegramente de vuelta a `develop` y hacia `main` (para la creación del Tag versionado).
