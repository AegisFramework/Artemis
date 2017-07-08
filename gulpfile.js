"use strict";

/* global require */

var gulp = require("gulp");
var header = require("gulp-header");
var concat = require("gulp-concat");
var pkg = require("./package.json");
var closureCompiler = require("google-closure-compiler").gulp();

var banner = ["/**",
	" * ==============================",
	" * Artemis <%= pkg.version %> | <%= pkg.license %> License",
	" * <%= pkg.homepage %>",
	" * ==============================",
	" */",
	"",
	"\"use strict\";",
	""
].join("\n");

gulp.task("default", function () {
	return gulp.src("src/**")
		.pipe(concat({ path: "artemis.js", stat: { mode: "0664" }, newLine: "\r\n"}))
		.pipe(header(banner, { pkg : pkg }))
		.pipe(gulp.dest("dist/"))
		.pipe(closureCompiler({
			compilation_level: "WHITESPACE_ONLY",
			language_in: "ECMASCRIPT6_STRICT",
			language_out: "ECMASCRIPT5_STRICT",
			js_output_file: "artemis.min.js"
		})
	).pipe(gulp.dest("dist/"));
});