// vite.config.mjs
import { defineConfig } from "file:///R:/Programming/NodeCG/ASGX2023/bundles/asm-graphics/node_modules/vite/dist/node/index.js";
import react from "file:///R:/Programming/NodeCG/ASGX2023/bundles/asm-graphics/node_modules/@vitejs/plugin-react/dist/index.mjs";
import NodeCGPlugin from "file:///R:/Programming/NodeCG/ASGX2023/bundles/asm-graphics/node_modules/vite-plugin-nodecg/dist/index.js";
import { globby } from "file:///R:/Programming/NodeCG/ASGX2023/bundles/asm-graphics/node_modules/globby/index.js";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiUjpcXFxcUHJvZ3JhbW1pbmdcXFxcTm9kZUNHXFxcXEFTR1gyMDIzXFxcXGJ1bmRsZXNcXFxcYXNtLWdyYXBoaWNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJSOlxcXFxQcm9ncmFtbWluZ1xcXFxOb2RlQ0dcXFxcQVNHWDIwMjNcXFxcYnVuZGxlc1xcXFxhc20tZ3JhcGhpY3NcXFxcdml0ZS5jb25maWcubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9SOi9Qcm9ncmFtbWluZy9Ob2RlQ0cvQVNHWDIwMjMvYnVuZGxlcy9hc20tZ3JhcGhpY3Mvdml0ZS5jb25maWcubWpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCBOb2RlQ0dQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tbm9kZWNnJztcclxuaW1wb3J0IHsgZ2xvYmJ5IH0gZnJvbSAnZ2xvYmJ5JztcclxuXHJcbi8vIGV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbi8vIFx0cGx1Z2luczogW1xyXG4vLyBcdFx0Tm9kZUNHUGx1Z2luKCksXHJcbi8vIFx0XSxcclxuLy8gXHRidWlsZDoge1xyXG4vLyBcdFx0cm9sbHVwT3B0aW9uczoge1xyXG4vLyBcdFx0XHRpbnB1dDogYXdhaXQgZ2xvYmJ5KFsnLi9zcmMvZGFzaGJvYXJkLyoudHN4JywgJy4vc3JjL2dyYXBoaWNzLyoudHN4J10pLFxyXG4vLyBcdFx0fSxcclxuLy8gXHR9LFxyXG4vLyBcdHNlcnZlcjoge1xyXG4vLyBcdFx0cG9ydDogMzAwMCxcclxuLy8gXHR9LFxyXG4vLyB9KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoKSA9PiB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHBsdWdpbnM6IFtcclxuXHRcdFx0cmVhY3Qoe1xyXG5cdFx0XHRcdGV4Y2x1ZGU6IC9cXC5zdG9yaWVzXFwuKHR8ailzeD8kLyxcclxuXHRcdFx0XHRpbmNsdWRlOiAnKiovKi50c3gnLFxyXG5cdFx0XHR9KSxcclxuXHRcdFx0Tm9kZUNHUGx1Z2luKHtcclxuXHRcdFx0XHRpbnB1dHM6IHtcclxuXHRcdFx0XHRcdCcuL3NyYy9ncmFwaGljcy8qLnRzeCc6ICcuL3NyYy9ncmFwaGljcy90ZW1wbGF0ZS5odG1sJyxcclxuXHRcdFx0XHRcdCcuL3NyYy9kYXNoYm9hcmQvKi50c3gnOiAnLi9zcmMvZGFzaGJvYXJkL3RlbXBsYXRlLmh0bWwnLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH0pLFxyXG5cdFx0XSxcclxuXHRcdHNlcnZlcjoge1xyXG5cdFx0XHRwb3J0OiAzMDAwLFxyXG5cdFx0fSxcclxuXHR9O1xyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5VixTQUFTLG9CQUFvQjtBQUN0WCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxrQkFBa0I7QUFDekIsU0FBUyxjQUFjO0FBZ0J2QixJQUFPLHNCQUFRLGFBQWEsTUFBTTtBQUNqQyxTQUFPO0FBQUEsSUFDTixTQUFTO0FBQUEsTUFDUixNQUFNO0FBQUEsUUFDTCxTQUFTO0FBQUEsUUFDVCxTQUFTO0FBQUEsTUFDVixDQUFDO0FBQUEsTUFDRCxhQUFhO0FBQUEsUUFDWixRQUFRO0FBQUEsVUFDUCx3QkFBd0I7QUFBQSxVQUN4Qix5QkFBeUI7QUFBQSxRQUMxQjtBQUFBLE1BQ0QsQ0FBQztBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNQLE1BQU07QUFBQSxJQUNQO0FBQUEsRUFDRDtBQUNELENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
