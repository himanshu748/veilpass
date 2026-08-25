# VeilPass fidelity ledger

Accepted concept references:

- `outputs/veilpass-landing-concept-hero.png`
- `outputs/veilpass-landing-concept-middle.png`
- `outputs/veilpass-landing-concept-final.png`

Implementation evidence was captured with the in-app Browser tool at 1440 px and 360 px widths, then inspected with `view_image`. Both measured `document.documentElement.scrollWidth` equal to the viewport width. The later attempt to repeat the check at tablet widths was blocked by the browser security policy, so no tablet claim is made here.

## Comparison

1. The desktop hero preserves the concept's asymmetric editorial layout: oversized black promise on the left and a technical proof instrument on the right.
2. The visual system remains true white with black typography, Compact violet for private inputs and verification green for public receipts.
3. Manrope is self-hosted and keeps the dense technical-instrument tone without external font requests.
4. The private-to-public aperture remains the dominant product metaphor in the hero, proof workspace and disclosure comparison.
5. The proof workspace converts the concept into a working three-part product flow: private credential, Compact boundary and public receipt.
6. Mobile recomposes the workspace into a vertical sequence without page-level horizontal overflow. Controls and footer links meet the 44 px touch-target requirement.
7. The verifier now presents both authenticated and fail-closed rejected states, which were not represented in the original landing concept.
8. Copy intentionally differs wherever the concept said “local proof mode” or “simulation”. The product now states “generated Compact runtime” and names the remaining proof-server, Lace and Preprod boundary directly.

## Remaining deviation

The complete-page in-app browser screenshot uses tiled stitching and visually duplicated some sections even though DOM counts confirmed each section existed once. Viewport screenshots are the fidelity source of truth. Tablet rendering should be rechecked manually before public redeployment because browser policy blocked that final automated resize.
