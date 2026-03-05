# Política de Versionado y Deprecación

Este documento establece los estándares y procedimientos para el versionado, mantenimiento de contratos y políticas de ciclo de vida del software aplicables a todos los repositorios y servicios del cliente. Dado el ecosistema a gran escala (múltiples repositorios y cientos de ramas), la rigurosidad en estas prácticas es esencial para garantizar la estabilidad, la retrocompatibilidad y entregas fluidas con el menor impacto operativo posible.

## 1. Versionado Semántico (SemVer)

Todos los proyectos, bibliotecas (librerías), artefactos y servicios deben adherirse estrictamente a **[Semantic Versioning 2.0.0](https://semver.org/)**.

El formato de versión es **`MAJOR.MINOR.PATCH`** (ej. `2.14.3`):

*   **`MAJOR` (Mayor):** Se incrementa cuando se realizan cambios incompatibles en la API o al introducir **Breaking Changes**. Al incrementar, los valores `MINOR` y `PATCH` se reinician a `0`.
*   **`MINOR` (Menor):** Se incrementa cuando se añade funcionalidad de manera retrocompatible (no rompe la integración existente). Al incrementar, el valor `PATCH` se reinicia a `0`.
*   **`PATCH` (Parche):** Se incrementa cuando se realizan correcciones de errores (bug fixes) de manera retrocompatible.

**Estrategia en modelo GitFlow (Flujo Estándar):**
El ciclo de versionado y la creación de etiquetas (Tags, ej. `v1.0.0`) ocurren de acuerdo con nuestra estrategia oficial de ramas dictaminada por el modelo GitFlow:

*   **Rama `main` (Producción):** Es la fuente de la verdad para ambientes vivos. Las versiones estables habitan y se etiquetan exclusivamente aquí. 
    *   **Incremento `MINOR` o `MAJOR`:** Ocurre cuando se fusiona una rama de preparación de `stagging/` hacia la rama `main` (ej. se cierra un ciclo de entrega completo).
    *   **Incremento `PATCH`:** Ocurre únicamente cuando se interviene producción por una falla y se fusiona desde una rama de corrección `hotfix/` directo hacia la rama `main`.
*   **Rama `develop` (Integración):** Representa el código en construcción que saldrá en la *próxima* versión `MINOR` o `MAJOR`. Aglomera las nuevas funcionalidades y puede emitir versiones preliminares en ambientes de Pruebas o QA (ej. `-alpha` o `-beta`).
*   **Ramas de Soporte (`feature/`):** Usan versiones efímeras o _pre-stagging_ automáticas dependientes del nombre de la rama para generar builds temporales aislados (ej. `1.5.0-feature-login.1`), logrando pruebas de integración continua (CI) sin obstruir versiones oficiales.

> 💡 **Nota:** Para conocer las reglas exactas sobre cómo estructurar los mensajes de commit para la automatización, y el tutorial paso a paso sobre el manejo de ramas, consulta el documento **[Flujo de Trabajo de Git](./GIT_WORKFLOW.md)**.


## 2. Definición y Uso del `contractVersion`

En un esquema de múltiples repositorios interconectados (ej. Microservicios, APIs de consumo masivo o arquitecturas Orientadas a Eventos), el control del **`contractVersion`** define el acuerdo de comunicación entre productores y consumidores.

*   **¿Qué es?** Es un identificador que define la versión estricta de la interfaz, el esquema o payload (OpenAPI/Swagger, esquemas GraphQL, `.proto`, etc.).
*   **Evolución desacoplada:** El `contractVersion` evoluciona de manera independiente al SemVer del repositorio. Un parche interno de seguridad en un servicio eleva su `PATCH` SemVer, pero NO altera el `contractVersion`.
*   **Estrategia de Exposición:** El ciclo de vida del `contractVersion` suele ser explícito e indicarse a través de la URI (ej. `/api/v1/resource`, `/api/v2/resource`) o empleando _Content Negotiation_ en los _Headers_ de redes (ej. `Accept: application/vnd.company.v2+json`). Cambiar sustancialmente el contrato eleva este número.

## 3. Breaking Changes (Cambios Rupturistas)

En este ecosistema corporativo con dependencias entrelazadas cruzando cientos de repositorios, los Breaking Changes son extremadamente perjudiciales e implican un esfuerzo de coordinación a gran escala.

Se considera un **Breaking Change** a toda modificación en que los consumidores del recurso deban modificar o adaptar proactivamente su código para que las aplicaciones continúen operativas de forma exitosa.

**Tipificación de Breaking Changes:**
*   Eliminar, renombrar o mover endpoints, interfaces, variables globales, clases exportadas o columnas en BD.
*   Añadir obligatoriedad a campos que antes eran opcionales, u obligar a consumir un nuevo parámetro.
*   Modificar de manera drástica el formato o los tipos de datos devueltos.
*   Alteraciones en la lógica o secuencia de llamadas esperada (por ejemplo un cambio severo de validación u obligar un _State_ intermedio no contemplado).

**Políticas Preventivas:**
1.  **Principio Open/Closed:** Para evitar incrementos de MAJOR, preferir la **extensión**. Por ejemplo, para requerir nueva información en un endpoint existente: incorporar los datos de forma opcional (`nullable`) mitigando la ruptura con clientes desactualizados.
2.  **Transición Concurrente:** Cuando un Breaking Change es inevitable, NUNCA se reemplaza la pieza de inmediato. Se debe lanzar el nuevo componente (o una  `v2` de la API) al lado del antiguo (que sigue vivo en su `v1`), manteniendo el servicio estable en todos los _branches_ remotos vigentes del cliente.

## 4. Política de Deprecación (Deprecation Policy)

Cualquier esfuerzo de eliminación o reemplazo de funcionalidad existente detona el flujo de deprecación. Considerando los cientos de branches, cualquier eliminación abrupta originará bloqueos inmediatos en líneas de desarrollo en curso y una catástrofe conocida como _Merge Hell_.

**Ciclo de vida Estándar de Deprecación:**

1.  **Fase de Aviso / Etiquetado (Notice / deprecating phase):**
    *   El recurso se anota a nivel código vía decoradores/anotaciones (`@Deprecated`, `[Obsolete]`, etc.) y directamente en los manifiestos de contratos (Swagger/OpenAPI).
    *   **Registro Histórico obligatorio:** Todo mensaje de advertencia debe incluir: 
        *   _En qué versión concreta inicia la deprecación._
        *   _Fecha o Versión tentativa de Eliminación (End Of Life)._
        *   _El enlace a la documentación de migración, alternativa o nuevo endpoint._
    *   Los equipos y consumidores deben empezar a visualizar la alerta durante los tiempos de compilación y en logs, mas nunca fallas fatales (Soft-fails).

2.  **Periodo de Gracia Activa:**
    *   El recurso continúa _online_ y operando al cien por ciento de su capacidad habitual. Este periodo provee el tiempo a que ramas desfasadas converjan a la rama principal (main/master).
    *   **Duración Corporativa:** Considerando el tamaño del cliente, el periodo de gracia mínimo será típicamente entre **3 a 6 meses** desde su anuncio público, extendible dependiendo la criticidad y métricas de tráfico.

3.  **Fase de Interrupción Programada controlada (Brownout phase) - Opcional/Críticos:**
    *   Se provocan errores esporádicos programados (por horas cortas establecidas) para forzar y detectar sistemas huérfanos que sigan enganchados al recurso deprecado y requieran de los dueños.

4.  **End of Life (EOL) / Retiro total (Sunsetting):**
    *   Solo se puede proceder cuando informes de métricas, análisis estático y logs de tráfico validen de forma rotunda el desuso del elemento.
    *   La porción de código es purgada del sistema y su retiro entra al sistema desencadenando un cambio en la rama principal que incrementará definitivamente la etiqueta **SemVer de nivel MAJOR**.
