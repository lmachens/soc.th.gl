## V0

-   Use style utilities instead of hard-coding styles
    (e.g., NavbarCollectionLinks.styles.ts).
-   Add nodes (or corner nodes) for special units, like Tremors.
-   Display buildable units (similar to the game's draft screen).
-   Resize the graph for mobile, size the graph container, limit scrolling
    (especially getting stuck in the graph on small screens).

## V1

-   Add building sizes like S/M/L to the data
    (so that we can calculate needed town size).
-   Calculate needed income for achieving build.
-   Add tooltips to buildings showing which building is available.
-   Display mana generation per unit.
-   Add share button and sync URL with build.

## V2+

-   Allow selecting unit stack counts (up to max stacks possible for wielder).
    -   Show mana generation totals.
        -   Add a tab for available spells.
-   Allow reverse-build selection, e.g., click unit to show buildings needed.
