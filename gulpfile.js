"use strict";

const gulp = require("gulp");
const { series, parallel } = require("gulp");
const server = require("browser-sync").create();
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const plumber = require("gulp-plumber");
const autoprefixer = require("gulp-autoprefixer");
const sourcemap = require("gulp-sourcemaps");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const webp = require("imagemin-webp");
const svgstore = require("gulp-svgstore");
const extReplace = require("gulp-ext-replace");
const del = require("del");

function scss() {
  return gulp
    .src(["./pages/scss/main/main.scss", "./pages/scss/pets/pets.scss"], {
      base: "./pages/scss/",
    })
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest("./pages/"))
    .pipe(server.stream());
}

function scssBuild() {
  return gulp
    .src(["./pages/scss/main/main.scss", "./pages/scss/pets/pets.scss"], {
      base: "./pages/scss/",
    })
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("./build/pages/"))
    .pipe(server.stream());
}

function minifyHTML() {
  return gulp
    .src(["./pages/main/main.html", "./pages/pets/pets.html"], {
      base: "./pages/",
    })
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("./build/pages/"));
}

function images() {
  return gulp
    .src("./assets/**/*.{png,jpg}", { base: "./assets/" })
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.mozjpeg({ quality: 85, progressive: true }),
      ])
    )
    .pipe(gulp.dest("./build/assets/"));
}

function makeWebp() {
  return gulp
    .src([
      "assets/**/*.jpg",
      "assets/**/*.png",
      "!assets/**/*+(-background).png",
      "!assets/**/noise_transparent.png",
    ])
    .pipe(
      imagemin([
        webp({
          quality: 80,
          alphaQuality: 90,
        }),
      ])
    )
    .pipe(extReplace(".webp"))
    .pipe(gulp.dest("./assets/"));
}

function helpSprite() {
  return gulp
    .src("./assets/icons/help/*.svg")
    .pipe(svgstore())
    .pipe(gulp.dest("./assets/icons/"));
}

function miscSprite() {
  return gulp
    .src("./assets/icons/misc/*.svg")
    .pipe(svgstore())
    .pipe(gulp.dest("./assets/icons"));
}

function copyAssets() {
  return gulp
    .src(
      [
        "assets/fonts/**/*",
        "assets/icons/*.svg",
        "assets/*.json",
        "assets/*.webp",
      ],
      {
        base: "./assets",
      }
    )
    .pipe(gulp.dest("./build/assets/"));
}

function copyScripts() {
  return gulp
    .src("./pages/**/*.js", { base: "./pages" })
    .pipe(gulp.dest("./build/pages/"));
}

function clean() {
  return del("./build/");
}

function serve() {
  server.init({
    server: {
      baseDir: "./",
      index: "./pages/pets/pets.html",
    },
  });
  gulp.watch("./pages/**/*.html").on("change", server.reload);
  gulp.watch("./pages/**/*.scss").on("change", () => setTimeout(scss, 200));
}

exports.webp = makeWebp;
exports.sprite = parallel(helpSprite, miscSprite);
exports.dev = series(scss, serve);
exports.build = series(
  clean,
  images,
  parallel(copyAssets, scssBuild, minifyHTML, copyScripts)
);
