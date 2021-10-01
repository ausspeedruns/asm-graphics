const contourShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float xSpeed = 0.02;
const float ySpeed = 0.01;
const float zSpeed = 0.002;
const float scale = 5.;

#define tanh(x)  ((pow(2.71828, x) - pow(2.71828, -x))/(pow(2.71828, x) + pow(2.71828, -x)))
#define hash3(p)  fract(sin(1e3*dot(p,vec3(1,57,-13.7)))*4375.5453)        // rand

float noise3( vec3 x , out vec2 g) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    vec3 F = f*f*(3.-2.*f);  // or smoothstep     // to make derivative continuous at borders

    float v000 = hash3(p+vec3(0,0,0)), v100 = hash3(p+vec3(1,0,0));
    float v010 = hash3(p+vec3(0,1,0)), v110 = hash3(p+vec3(1,1,0));
    float v001 = hash3(p+vec3(0,0,1)), v101 = hash3(p+vec3(1,0,1));
    float v011 = hash3(p+vec3(0,1,1)), v111 = hash3(p+vec3(1,1,1));

    g.x = 6.*f.x*(1.-f.x)                        // gradients
          * mix( mix( v100 - v000, v110 - v010, F.y),
                 mix( v101 - v001, v111 - v011, F.y), F.z);
    g.y = 6.*f.y*(1.-f.y)
          * mix( mix( v010 - v000, v110 - v100, F.x),
                 mix( v011 - v001, v111 - v101, F.x), F.z);

    return mix( mix(mix( v000, v100, F.x),       // triilinear interp
                    mix( v010, v110, F.x),F.y),
                mix(mix( v001, v101, F.x),
                    mix( v011, v111, F.x),F.y), F.z);
}


float noise(vec3 x, out vec2 g) {     // pseudoperlin improvement from foxes idea
    vec2 g0;
    vec2 g1;
    float n = (noise3(x,g0)+noise3(x+11.5,g1)) / 2.;
    g = (g0+g1)/2.;
    return n;
}

void main() {
    vec2 R = u_resolution.xy;
    vec2 U = gl_FragCoord.xy * scale/R.y;
    vec2 g;
    float n = noise(vec3(U.x + xSpeed*u_time, U.y + ySpeed*u_time, zSpeed * u_time), g);
    float v = sin(6.28*10.*n);
    g *= 6.28*10.*cos(6.28*10.*n) * 8./R.y;
    v = tanh(min(2.*abs(v) / (abs(g.x)+abs(g.y)),10.)); // some systems dislike tanh(big)
    n = floor(n*20.)/20.;
    v = v < 0.8 ? 0. : v;
    gl_FragColor = (v * vec4(0.04, 0.05, 0.07, 1)) + vec4(0.15, 0.09, 0.01, 1);
}
`;

export default contourShader;
