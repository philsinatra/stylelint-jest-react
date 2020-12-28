# Keeping your CSS in JS clean

A guide to using stylelint with emotion or styled-components

Malcolm Laing

Jun 9, 2019 · 4 min read

[Medium](https://medium.com/swlh/keeping-your-css-in-js-clean-with-stylelint-8822c8c1543a)

## Let’s lint some CSS!

Let’s start by creating a new React application. For this, we can use create-react-app.

```bash
create-react-app my-app
```

Next, we add some dependencies. We can start by adding emotion.

```bash
cd my-app
yarn add @emotion/core @emotion/styled
```

This installs the two emotion dependencies. We can style components in two different ways with emotion. To make sure our linting works properly, we should start by creating and styling components.

### Styling components with the CSS prop

Using the `css` prop, we can pass in either object styles, or string styles.

```javascript
import { jsx, css } from "@emotion/core";
const Footer = props => (
  <footer
    css={{
      // object styles!
      width: "100%",
    }}
  >
    <p
      css={css`
        /* string styles */
        color: blue;
        text-align: centre;
        font-size: 1.2re;
      `}
    >
      {props.children}
    </p>
  </footer>
);
export default Footer;
```

In this code example, we created a footer component. We styled the footer tag with object styles, and the paragraph tag with string styles. For more information, check out the emotion documentation.

### Using Styled components

Using styled, we can pass styles to html tags.

```javascript
import React from "react";
import styled from "@emotion/styled";
const StyledHeader = styled.header`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const StyledH1 = styled.h1`
  font-size: 2re;
`;
const Header = props => (
  <StyledHeader>
    <StyledH1>{props.children}</StyledH1>
  </StyledHeader>
);
export default Header;
```

In this code example, we created a header component, and we styled it with the styled prop. For more information, check out the [emotion documentation](https://emotion.sh/docs/styled).

### Introducing stylelint

Now that we have styled some components, let’s get linting!

```bash
yarn add -D stylelint stylelint-config-standard
```

Then create a file called .stylelintrc

```json
{
  "extends": [
    "stylelint-config-standard"
  ]
}
```

Then we add a npm script to our package.json

```json
"lint:css": "stylelint './src/*.js'"
```

We can then run the script, and we get the following output

```bash
$ stylelint './src/*.js'
src/footer.js
 17:20  ✖  Unexpected unknown unit "re"        unit-no-unknown
 18:6   ✖  Unexpected missing end-of-source    no-missing-end-of-source-newline
           newline
src/header.js
  5:3  ✖  Expected empty line before declaration  declaration-empty-line-before
 13:3  ✖  Expected empty line before declaration  declaration-empty-line-before
error Command failed with exit code 2.
```

As you can see, we get a few lint errors. This is due to the fact that stylelint-config-standard is optimized for plain old CSS. Let’s add a few rule overrides to our .stylelintrc file.

```json
{
  "extends": [
    "stylelint-config-standard"
  ],
  "rules": {
    "no-empty-source": null,
    "declaration-empty-line-before": null,
    "no-missing-end-of-source-newline": null,
  }
}
```

Now we can run yarn lint:css and we get the following output.

```bash
$ stylelint './src/*.js'
src/footer.js
 17:20  ✖  Unexpected unknown unit "re"   unit-no-unknown
src/header.js
 13:14  ✖  Unexpected unknown unit "re"   unit-no-unknown
```

Woops! 😱 Looks like we wrote some bad CSS. Good thing stylelint was there to catch us 😅. As you can see, stylelint caught our mistakes in components styled with both the css prop, and the styled prop. Pretty cool!

## Using jest with stylelint

Jest is a great way to run your tests, so why not use it for linting as well?

Start by installing some dependencies.

```bash
yarn add -D jest jest-runner-stylelint
```

Next, create jest.stylelint.config.js

```javascript
module.exports = {
  runner: "jest-runner-stylelint",
  displayName: "stylelint",
  moduleFileExtensions: ["js"],
  testMatch: ["<rootDir>/src/**/*.js"],
};
```

Then, we update our lint:css command to the following

```json
"lint:css": "jest --config jest.stylelint.config.js
```

Then we run lint:css again.

```bash
$ jest --config jest.stylelint.config.js
 FAIL   stylelint  src/serviceWorker.js
src/serviceWorker.js
 25:5  ✖  Unknown word   CssSyntaxError
```

Ah, what’s this? Looks like jest-runner-stylelint is using version 8.3.1 of stylelint. That’s before stylelint added support for CSS in JS.

Let’s force jest-runner-stylelint to use the latest version of stylelint. Simply add a resolutions field to your package.json

```json
"resolutions": {
    "jest-runner-stylelint/stylelint": "10.0.1"
 }
```

Then run yarn again to reinstall the dependencies, and run yarn `lint:css`

This time, we get the same output as before

```bash
$ jest --config jest.stylelint.config.js
 PASS   stylelint  src/serviceWorker.js
 FAIL   stylelint  src/footer.js
src/footer.js
 17:20  ✖  Unexpected unknown unit "re"   unit-no-unknown
PASS   stylelint  src/App.test.js
 PASS   stylelint  src/App.js
 PASS   stylelint  src/index.js
 FAIL   stylelint  src/header.js
src/header.js
 13:14  ✖  Unexpected unknown unit "re"   unit-no-unknown
Test Suites: 2 failed, 4 passed, 6 total
Tests:       2 failed, 4 passed, 6 total
```

Now all that is left to do is fix up those unknown units, and we are good to go 🚀.

Check out the [repository on github](https://github.com/montezume/stylelint-css-in-js).
