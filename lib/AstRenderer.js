import { Linking } from 'react-native';

let uuid = new Date().getTime();

/**
 *
 */
export default class AstRenderer {
  /**
     *
	 * @return {string}
	 */
  static getUniqueID() {
    uuid++;
    return uuid.toString(16);
  }

  static hasParents(parents, type) {
    return parents.findIndex(el => el.type === type) > -1;
  }

  static openUrl = url => {
    Linking.openURL(url);
  };

  /**
   *
   * @param {Object.<string, function>} renderFunctions
   */
  constructor(renderFunctions) {
    this._renderFunctions = renderFunctions;
  }

  /**
     *
	 * @param {string} type
	 * @return {string}
	 */
  getRenderFunction = type => {
    const renderFunction = this._renderFunctions[type];
    if (!renderFunction) {
      throw new Error(`${type} renderer not defined`);
    }
    return renderFunction;
  };

  /**
     *
	 * @param node
	 * @param parentNodes
	 * @return {*}
	 */
  renderNode = (node, parentNodes, style) => {
    const renderFunction = this.getRenderFunction(node.type);

    const parents = [...parentNodes];
    parents.unshift(node);

    if (node.type === 'text') {
      return renderFunction(node, [], parentNodes, style);
    }

    const children = node.children.map(value => {
      return this.renderNode(value, parents, style);
    });

    return renderFunction(node, children, parentNodes, style);
  };

  /**
   *
   * @param nodes
   * @return {*}
   */
  render = (nodes, style) => {
    const children = nodes.map(value => {
      return this.renderNode(value, [], style);
    });
    const renderFunction = this.getRenderFunction('root');
    return renderFunction(children);
  };
}