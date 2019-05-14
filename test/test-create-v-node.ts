'use strict';
const Expect: Chai.ExpectStatic = require('chai').expect;
const Should: Chai.ShouldAssertion = require('chai').should();
import createVNode from '../src/vdom/createVNode';

describe('creating v-nodes', function() {
  describe('#createVNode', function() {
    const vNode = createVNode(
      'div',
      {
        id: 'app'
      },
      [{ tagName: 'p' }, 'helloworld']
    );
    it('should have a tag name of type string', function() {
      Expect(vNode).to.have.property('tagName');
      Expect(vNode.tagName).to.be.a('string');
    });
  });
});
