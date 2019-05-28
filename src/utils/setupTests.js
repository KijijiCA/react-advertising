import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'regenerator-runtime/runtime';

configure({ adapter: new Adapter() });

chai.should();
chai.use(sinonChai);
chai.use(chaiEnzyme());

// Make sure chai and jasmine ".not" play nice together
const originalNot = Object.getOwnPropertyDescriptor(chai.Assertion.prototype, 'not').get;
Object.defineProperty(chai.Assertion.prototype, 'not', {
    get() {
        Object.assign(this, this.assignedNot);
        return originalNot.apply(this);
    },
    set(newNot) {
        this.assignedNot = newNot;
        return newNot;
    }
});

// Combine both jest and chai matchers on expect
const jestExpect = global.expect;

global.expect = actual => {
    const originalMatchers = jestExpect(actual);
    const chaiMatchers = chai.expect(actual);
    return Object.assign(chaiMatchers, originalMatchers);
};

// Fix error message “A "describe" callback must not return a value.”
// https://stackoverflow.com/a/55211488/1253156
const realDescribe = global.describe;
global.describe = (name, fn) => {
    realDescribe(name, () => {
        fn();
    });
};
