var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;
var WIDTH = 800;
var HEIGHT = 400;
var fps = 60;
var interval = 1000/fps;
var dt = 50/fps
var delta;
var then;

var toLoad = 3;
var loaded = 0;

var mapsizex = 12;
var mapsizey = 6;
var bglayer;
var gamelayer;
var bgctx;
var gamectx;

var gravity = 0.7*dt;
var tilewidth = WIDTH / mapsizex;
var tileheight = HEIGHT / mapsizey;
var map = [
    [1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0],
    [1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
    [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
];