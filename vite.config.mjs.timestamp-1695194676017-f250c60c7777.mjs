// vite.config.mjs
import { defineConfig } from "file:///G:/Programming/NodeCG/PAX2023/bundles/asm-graphics/node_modules/vite/dist/node/index.js";
import react from "file:///G:/Programming/NodeCG/PAX2023/bundles/asm-graphics/node_modules/@vitejs/plugin-react/dist/index.mjs";
import NodeCGPlugin from "file:///G:/Programming/NodeCG/PAX2023/bundles/asm-graphics/node_modules/vite-plugin-nodecg/dist/index.js";
var vite_config_default = defineConfig(() => {
  return {
    plugins: [
      react({
        exclude: /\.stories\.(t|j)sx?$/,
        include: "**/*.tsx"
      }),
      NodeCGPlugin({
        inputs: {
          "./src/graphics/*.tsx": "./src/graphics/template.html",
          "./src/dashboard/*.tsx": "./src/dashboard/template.html"
        }
      })
    ],
    server: {
      port: 3e3
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRzpcXFxcUHJvZ3JhbW1pbmdcXFxcTm9kZUNHXFxcXFBBWDIwMjNcXFxcYnVuZGxlc1xcXFxhc20tZ3JhcGhpY3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkc6XFxcXFByb2dyYW1taW5nXFxcXE5vZGVDR1xcXFxQQVgyMDIzXFxcXGJ1bmRsZXNcXFxcYXNtLWdyYXBoaWNzXFxcXHZpdGUuY29uZmlnLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRzovUHJvZ3JhbW1pbmcvTm9kZUNHL1BBWDIwMjMvYnVuZGxlcy9hc20tZ3JhcGhpY3Mvdml0ZS5jb25maWcubWpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgTm9kZUNHUGx1Z2luIGZyb20gXCJ2aXRlLXBsdWdpbi1ub2RlY2dcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoKSA9PiB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHBsdWdpbnM6IFtcclxuXHRcdFx0cmVhY3Qoe1xyXG5cdFx0XHRcdGV4Y2x1ZGU6IC9cXC5zdG9yaWVzXFwuKHR8ailzeD8kLyxcclxuXHRcdFx0XHRpbmNsdWRlOiBcIioqLyoudHN4XCIsXHJcblx0XHRcdH0pLFxyXG5cdFx0XHROb2RlQ0dQbHVnaW4oe1xyXG5cdFx0XHRcdGlucHV0czoge1xyXG5cdFx0XHRcdFx0XCIuL3NyYy9ncmFwaGljcy8qLnRzeFwiOiBcIi4vc3JjL2dyYXBoaWNzL3RlbXBsYXRlLmh0bWxcIixcclxuXHRcdFx0XHRcdFwiLi9zcmMvZGFzaGJvYXJkLyoudHN4XCI6IFwiLi9zcmMvZGFzaGJvYXJkL3RlbXBsYXRlLmh0bWxcIixcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9KSxcclxuXHRcdF0sXHJcblx0XHRzZXJ2ZXI6IHtcclxuXHRcdFx0cG9ydDogMzAwMCxcclxuXHRcdH0sXHJcblx0fTtcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1YsU0FBUyxvQkFBb0I7QUFDblgsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sa0JBQWtCO0FBRXpCLElBQU8sc0JBQVEsYUFBYSxNQUFNO0FBQ2pDLFNBQU87QUFBQSxJQUNOLFNBQVM7QUFBQSxNQUNSLE1BQU07QUFBQSxRQUNMLFNBQVM7QUFBQSxRQUNULFNBQVM7QUFBQSxNQUNWLENBQUM7QUFBQSxNQUNELGFBQWE7QUFBQSxRQUNaLFFBQVE7QUFBQSxVQUNQLHdCQUF3QjtBQUFBLFVBQ3hCLHlCQUF5QjtBQUFBLFFBQzFCO0FBQUEsTUFDRCxDQUFDO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ1AsTUFBTTtBQUFBLElBQ1A7QUFBQSxFQUNEO0FBQ0QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
