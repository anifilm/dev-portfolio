// built-in
import path from 'path';
// @rollup
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import strip from '@rollup/plugin-strip';
// rollup
import svelte from 'rollup-plugin-svelte';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import replace from 'rollup-plugin-replace';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
// external
import sveltePreprocess from 'svelte-preprocess';

// Rollup Watch 기능(-w)이 동작하는 경우만 '개발 모드'라고 판단합니다.
const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    // 실행중인 서버가 있으면 바로 종료
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      // 서버가 있으면 실행하지 않음
      if (server) return;
      // 서버 생성
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });
      // 프로세스 종료 이벤트(SIGTERM, exit)에 서버 종료하도록 핸들링
      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}

export default {
  // 진입점
  input: 'src/main.js',
  // 번들 출력
  output: {
    // 번들의 소스맵 파일을 생성. 소스맵은 난독화 파일을 해석해서 성능 향상에 도움을 준다.
    sourcemap: true,
    // 번들의 포멧을 지정. `iife`는 HTML SCRIPT 태그에서 사용하기에 적합한 번들을 생성
    format: 'iife',
    // 번들의 전역 변수 이름. `iife` 포멧을 사용하는 경우에 필요
    name: 'app',
    // 번들이 생성되는 경로
    file: 'public/build/bundle.js'
  },
  plugins: [
    svelte({
			compilerOptions: {
				// 개발 모드에서 런타임 검사를 활성화
				dev: !production
			},
      // 전처리 옵션을 지정
      preprocess: sveltePreprocess({
        scss: {
          // 전역에서 사용할 SCSS 파일을 지정
          // 단, style 태그에 lang="scss"가 지정되어 있어야 적용된다.
          prependData: '@import "./src/scss/main.scss";'
        },
        // PostCSS는 Autoprefixer를 설치하면 같이 설치된다.(9버전)
        // 10버전 이상은 postcss를 별도 설치해야 한다.(npm i -D postcss)
        // Autoprefixer는 CSS에 자동으로 공급 업체 접두사(Vendor prefix)를 적용한다.
        postcss: {
          plugins: [
						require('autoprefixer')()
					]
        }
      })
    }),
		// Svelte 컴포넌트의 CSS를 별도 번들로 생성(성능 향상)
		css({ output: 'bundle.css' }),

    // replace~builtins까지는 다음과 같은 순서대로 작성해야 정상적으로 동작함에 주의!
    // 대부분의 플러그인은 Rollup 측에서 제공하는 것이 아니기 때문에,
    // 플러그인의 동작 순서를 파악하는 것은 사용자(개발자)의 몫이라고 설명하고 있다.

    // Crypto-random-string에서 내부적으로 randomBytes가 사용됨
    // Node Globals와 Builtins가 내부적으로 제공하지 않기 때문에,
    // 다음과 같이 지정(대체)해야 정상적으로 동작한다.
    // https://github.com/sindresorhus/crypto-random-string/blob/master/index.js
    replace({
      values: {
        'crypto.randomBytes': 'require("randombytes")'
      }
    }),
    // NPM으로 설치하는 외부 모듈을 번들에 포함한다.
    resolve({
      // 브라우저 환경을 위한 번들로 포함하도록 지시
      browser: true,
      // 중복 번들을 방지하기 위한 외부 모듈 이름을 지정
      dedupe: ['svelte']
    }),
    // 외부 모듈을 ES6 번들로 변환
    commonjs(),
    // 일부 Node 모듈이 필요로 하는 전역 API를 사용할 수 있다.
    globals(),
    // Node 내장 API를 사용할 수 있다.
    builtins(),

    // 경로 별칭을 지정
    // 상대 경로에 대한 별칭이 없으면, 프로젝트를 리팩토링할 때 문제가 생길 확률이 매우 높아진다.
    alias({
      entries: [{ find: '~', replacement: path.resolve(__dirname, 'src/') }]
    }),

    // For Development mode!
    // 개발 모드에서는 번들이 생성되면 `npm run start`를 호출
    !production && serve(),
    // 개발 모드에서는 'public' 디렉토리에서 변경사항이 확인되면 브라우저를 새로고침 한다.
    !production && livereload('public'),

    // For Production mode!
    // 제품 모드에서는 'console.log'같은 Console 명령을 제거한다.
    production &&
      strip({
        include: '**/*.(svelte|js)'
      }),
    // 제품 모드에서는 번들을 최소화(최적화) 한다.
    production && terser()
  ],
  watch: {
    // 다시 빌드할 때, 터미널 화면을 초기화하지 않는다.
    // 기본값은 `true`
    clearScreen: false
  }
};
