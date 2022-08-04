import {deleteAsync} from 'del';
import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import sync from 'browser-sync';
const sass = gulpSass(dartSass);
const watcher = () => {
    gulp.watch('./src/css/*.scss', gulp.series(styles));
    gulp.watch('./src/index.html', gulp.series(copy));
  }
const server = (done) => {
   sync.init({
     server: {
        baseDir: "build"
      },
      cors: true,
      notify: false,
      ui: false, 
    });
    done(); 
}
const copy = (done) => {
    gulp.src('./src/index.html')
      .pipe(gulp.dest("build"))
    done();
  }
export const clean = async ()=>{
    console.log('\x1b[36m%s\x1b[0m',`DELETE FOLDER: build`)
    return await deleteAsync(['build']);
}
export const styles = async ()=>{
    console.log('\x1b[36m%s\x1b[0m',`Start Styles`);
    return await gulp.src('./src/css/style.scss')
                .pipe(sass().on('error', sass.logError))
                .pipe(gulp.dest('./build'))
                .pipe(sync.stream());
}
export const build = gulp.series(clean, copy, gulp.parallel(
    styles
  ), gulp.series(
    server,
    watcher
  ));
