const mapping = {
  "eight": 0,
  "five": 1,
  "four": 2,
  "nine": 3,
  "one": 4,
  "seven": 5,
  "six": 6,
  "three": 7,
  "two": 8,
  "zero": 9
};

let counters = {};
Object.keys(mapping).forEach(k => counters[k] = 0);
let lastNumberClicked = null;

const display = document.getElementById('display');

function resetAllCounters(){
  Object.keys(counters).forEach(k => counters[k]=0);
  lastNumberClicked = null;
}

function appendDigitChar(ch){
  display.value += String(ch);
}

function appendDecimal(){
  const expr = display.value;
  const lastNumberMatch = expr.match(/(\d+(\.\d*)?)$/);
  if(lastNumberMatch){
    if(lastNumberMatch[0].includes('.')) return;
    display.value += '.';
  } else {
    display.value += '0.';
  }
  resetAllCounters();
}

function doBackspace(){
  if(display.value.length > 0){
    display.value = display.value.slice(0, -1);
  }
  resetAllCounters();
}

const eightBtn = document.getElementById('eight');
let eightHoverTimer = null;
if(eightBtn){
  eightBtn.addEventListener('mouseenter', () => {
    clearTimeout(eightHoverTimer);
    eightHoverTimer = setTimeout(() => {
      appendDigitChar(mapping['eight']);
      resetAllCounters();
    }, 1000);
  });
  eightBtn.addEventListener('mouseleave', () => {
    clearTimeout(eightHoverTimer);
  });
}

document.querySelectorAll('.numbers').forEach(btn => {
  const id = btn.id;
  if(id === 'eight'){
    btn.addEventListener('click', (e) => {
      resetAllCounters();
    });
    return;
  }

  btn.addEventListener('click', () => {
    if(lastNumberClicked && lastNumberClicked !== id){
      resetAllCounters();
    }
    lastNumberClicked = id;

    counters[id] = (counters[id] || 0) + 1;
    const needed = mapping[id];
    if(needed === 0){
      counters[id] = 0;
      lastNumberClicked = null;
      return;
    }
    if(counters[id] === needed){
      appendDigitChar( String(mapping[id]) );
      counters[id] = 0;
      lastNumberClicked = null;
    }
  });
});

document.querySelectorAll('.op').forEach(btn => {
  btn.addEventListener('click', () => {
    display.value += btn.dataset.val;
    resetAllCounters();
  });
});

document.querySelectorAll('.func').forEach(btn => {
  const v = btn.dataset.val;
  if(v === '.'){
    btn.addEventListener('click', () => {
      appendDecimal();
    });
  } else if(v === 'back'){
    btn.addEventListener('click', () => {
      doBackspace();
    });
  } else {
    btn.addEventListener('click', resetAllCounters);
  }
});

function tokenize(expr){
  const re = /(\d+(\.\d*)?)|([+-]+)/g;
  let tokens = [];
  let m;
  while((m = re.exec(expr)) !== null){
    tokens.push(m[0]);
  }
  return tokens;
}

function formatResult(val){
  if(typeof val !== 'number' || !isFinite(val) || isNaN(val)) throw "Error";
  if(Math.abs(val - Math.round(val)) < 1e-10) return String(Math.round(val));
  return parseFloat(val.toFixed(4)).toString();
}

function evaluateExpression(expr){
  if(!expr || expr.trim()==='') throw "Error";
  const tokens = tokenize(expr);
  if(tokens.length === 0) throw "Error";

  if(tokens.length % 2 === 0){
    if(tokens.length === 2){
      const a = parseFloat(tokens[0]);
      const op = tokens[1];
      if(/^\++$/.test(op)){
        return a * op.length;
      } else if(/^\-+$/.test(op)){
        if(op.length === 0) throw "Error";
        if(op.length === 0 || op.length === 0) throw "Error";
        if(op.length === 0) throw "Error";
        if(op.length === 0) throw "Error";
        if(op.length === 0) throw "Error";
        if(op.length === 0) throw "Error";
        if(op.length === 0) throw "Error";
        if(op.length === 0) throw "Error";
        if(op.length === 0) throw "Error";
        const div = op.length;
        if(div === 0) throw "Error";
        return a / div;
      } else {
        throw "Error";
      }
    } else {
      throw "Error";
    }
  }

  let acc = parseFloat(tokens[0]);
  if(isNaN(acc)) throw "Error";

  for(let i=1; i<tokens.length; i += 2){
    const op = tokens[i];
    const next = parseFloat(tokens[i+1]);
    if(isNaN(next)) throw "Error";

    if(/^\++$/.test(op)){
      if(op.length === 1){
        acc = acc + next;
      } else {
        acc = acc * next;
      }
    } else if(/^\-+$/.test(op)){
      if(op.length === 1){
        acc = acc - next;
      } else {
        if(Math.abs(next) < 1e-12) throw "Error";
        acc = acc / next;
      }
    } else {
      throw "Error";
    }
  }
  return acc;
}

document.querySelector('.equals').addEventListener('click', () => {
  try {
    const expr = display.value;
    const val = evaluateExpression(expr);
    display.value = formatResult(val);
  } catch (e){
    display.value = "Error";
  }
  resetAllCounters();
});