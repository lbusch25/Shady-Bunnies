#version 330

// Fragment shader

// Textures
uniform sampler2D diffuseRamp;
uniform sampler2D specularRamp;

uniform vec3 eye_world;

uniform vec4 lightPosition;

uniform vec3 ambientReflection;
uniform vec3 diffuseReflection;
uniform vec3 specularReflection;

uniform vec3 diffuseIntensity;
uniform vec3 ambientIntensity;
uniform vec3 specularIntensity;

uniform float specularExp;

// These get passed in from the vertex shader and are interpolated (varying) properties
// change for each pixel across the triangle:
in vec4 interpSurfPosition;

in vec3 interpSurfNormal;

// This is an out variable for the final color we want to render this fragment.
out vec4 fragColor;


void main() {

    vec3 normal = normalize(interpSurfNormal);
    vec3 lightDirection = normalize(lightPosition.xyz - interpSurfPosition.xyz);
    vec3 eyeDirection = normalize(eye_world - interpSurfPosition.xyz);
    vec3 Hvec = normalize(eyeDirection + lightDirection);
    
    float dotNL = dot(lightDirection, normal);
    float dotHN = dot(Hvec, normal);
    
    // Start with black and then add lighting to the final color as we calculate it
	vec3 finalColor = vec3(0.0, 0.0, 0.0);
    vec2 diffuseTex = vec2(max(0, dotNL), 0.0);
    vec2 specularTex = vec2(pow(max(0,dotHN), specularExp), 0.0);

    // TODO: Calculate ambient, diffuse, and specular lighting for this pixel based on its position, normal, etc.
    
    vec3 ambientColor = ambientReflection * ambientIntensity;
//    vec3 diffuseColor = diffuseReflection * diffuseIntensity * texture(diffuseRamp, diffuseTex);
    vec3 diffuseColor = diffuseReflection *diffuseIntensity * texture(diffuseRamp, diffuseTex).xyz;
//    vec3 specularColor = specularReflection * specularIntensity * pow(max(0,dotHN), specularExp);
    vec3 specularColor = specularReflection *specularIntensity * texture(specularRamp, specularTex).xyz;

    
    finalColor = ambientColor + diffuseColor + specularColor;
    
//    vec3 diffuseColor = diffuseReflection * diffuseIntensity * max(0, dotNL);
//    vec3 specularColor = specularReflection * specularIntensity * pow(max(0,dotHN), specularExp);
//    finalColor = texture(specularRamp, vec2(min(ambientColor.r + diffuseColor.r + specularColor.r, 0.999), 0)).rgb;
    
	// Tell OpenGL to use the r,g,b compenents of finalColor for the color of this fragment (pixel).
	fragColor.rgb = finalColor.rgb;

	// And, set the alpha component to 1.0 (completely opaque, no transparency).
	fragColor.a = 1.0;
}
