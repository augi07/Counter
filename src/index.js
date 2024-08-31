import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

// allows using html tags as functions in javascript
const { div, button, p, h1 } = hh(h);

// A combination of Tailwind classes which represent a (more or less nice) button style
const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

// Messages which can be used to update the model
const MSGS = {
    INCREASE: "INCREASE",
    DECREASE: "DECREASE",
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
  return div({ className: "flex flex-col gap-4 items-center" }, [
    h1({ className: "text-3xl font-bold" }, `Count: ${model.counter}`),
    div({ className: "flex gap-4" }, [
      button({ className: btnStyle, onclick: () => dispatch(MSGS.INCREASE) }, "+ Increase"),
      button({ className: btnStyle, onclick: () => dispatch(MSGS.DECREASE) }, "- Decrease"),
    ]),
  ]);
}

function update(msg, model) {
  switch (msg) {
    case MSGS.INCREASE:
      return { ...model, counter: model.counter + 1 };
    case MSGS.DECREASE:
      return { ...model, counter: model.counter - 1 };
    default:
      return model;
  }
}

function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

const initModel = {
  counter: 0,
};

const rootNode = document.getElementById("app");
app(initModel, update, view, rootNode);
