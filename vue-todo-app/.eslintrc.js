module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    // https://github.com/standard/eslint-config-standard
    'standard',
    // https://eslint.vuejs.org/rules/
    // 'plugin:vue/base'
    'plugin:vue/essential'
    // 'plugin:vue/strongly-recommended',
    // 'plugin:vue/recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2015,
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  rules: { // 예외 규칙을 추가할 수 있습니다.
    semi: ['error', 'always'], // 세미콜론 규칙 설정
    'space-before-function-paren': ['error', 'never'], // data() 함수명 괄호 공백 없이
    'no-unused-vars': 'off', // 임포트 파일 관련
    'spaced-comment': 0,
    'no-new': 0,
    'vue/html-self-closing': ['error', {
      'html': {
        'void': 'always',
        'normal': 'always',
        'component': 'always'
      },
      'svg': 'always',
      'math': 'always'
    }]
  }
}
