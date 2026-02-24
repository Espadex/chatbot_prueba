# Git Workflow: Estándar corporativo (Basado en GitFlow)

## 1. Contexto y Motivación: Unificación de Repositorios

Históricamente, los esfuerzos de desarrollo dentro de la empresa o cliente han operado en "silos", dando lugar a una fragmentación notable en las estrategias de integración y versionado. Tras una auditoría inicial, identificamos que los cientos de repositorios activos subsisten bajo **tres flujos de trabajo aislados e inconsistentes (As-Is)**:

1. **Flujo "Pipelines":**
   * _Estructura:_ `QA` → `main` (Producción). Carece de entorno o rama de integración (`develop`).
   * _Diagnóstico:_ Al omitir una rama `develop`, la rama de QA asume de forma errática toda la carga de integración continua. El control de las versiones es difuso y riesgoso.
   * _*(Aquí insertarías la imagen del diagrama de Pipelines `![Diagrama Pipelines](./assets/flujo-pipelines.png)`)*_

2. **Flujo "Merge":**
   * _Estructura:_ `develop` → `main` (Producción). La mayoría opera sin entorno dedicado de QA (a excepción de algunos repositorios aislados en Snowflake).
   * _Diagnóstico:_ Los desarrolladores se ven obligados a probar y estabilizar el código enteramente en `develop`. Este salto directo de Desarrollo a Producción provoca despliegues inestables al carecer de un periodo formal de validación y _bug-fixing_ previo al lanzamiento.
   * _*(Aquí insertarías la imagen del diagrama de Merge `![Diagrama Merge](./assets/flujo-merge.png)`)*_

3. **Flujo "Release" (Trunk-Based):**
   * _Estructura:_ `feature/` directas a `main` (aprobadas y tagueadas al final de la semana, ej. `v40.0.1`, `v41.0.0`). Cero ramas de integración.
   * _Diagnóstico:_ Todo código aterriza de golpe en la fuente de la verdad (`main`). Aunque logran velocidad e integran un control en PRs por aprobadores, el riesgo de estropear producción y la trazabilidad de los errores es extremadamente alta durante integraciones críticas.
   * _*(Aquí insertarías la imagen del diagrama de Release `![Diagrama Release](./assets/flujo-release.png)`)*_

---

### La Solución Homologada (To-Be)

La acumulación agresiva de ramas huérfanas o congeladas (en algunos casos más de 115 _features_ abiertas) y la carencia de entornos puente nos obliga a adoptar un estándar maduro y probado por la industria.

A partir de este documento, **todos los repositorios y células de ingeniería adoptan oficialmente el modelo estándar GitFlow** documentado por Atlassian.

El nuevo modelo **separa radicalmente los entornos y asegura la validación cruzada:**
* `develop` asume el rol íntegro de integración diaria.
* `release/` nace exclusivamente para que QA valide el software y limpie errores (Bugfixes) sin estorbar el desarrollo.
* `main` se blinda al 100%, admitiendo cambios solo una vez aprobados exhaustivamente.

_*(Y luego de esto, seguirías con el sub-título "Estrategia de Ramas" y el diagrama verde interactivo en Mermaid que hicimos antes)*_.
