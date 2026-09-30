// staticAssetsIncrementalCache: las páginas prerenderizadas ([slug] de
// calculadoras y guías) viven en .open-next/cache/, no en los assets
// estáticos. Sin este override, la caché por defecto (dummy) no las
// encuentra y con dynamicParams=false el worker responde 404.
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
	incrementalCache: staticAssetsIncrementalCache,
});
