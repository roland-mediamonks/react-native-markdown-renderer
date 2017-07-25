/**
 * Base Markdown component
 * @author Mient-jan Stelling
 */
import React, {Component, PropTypes} from 'react';
import {View} from 'react-native';
import {parser, stringToTokens, tokensToAST} from './lib/parser';
import defaultRenderFunctions from './lib/defaultRenderFunctions';
import AstRenderer from './lib/AstRenderer';
import MarkdownIt from 'markdown-it';
import PluginContainer from "./lib/PluginContainer";
import blockPlugin from "./lib/blockPlugin";

/**
 *
 */
export {defaultRenderFunctions, AstRenderer, parser, stringToTokens, tokensToAST, MarkdownIt, PluginContainer, blockPlugin};

export default class Markdown extends Component {
    /**
     * Definition of the prop types
     */
    static propTypes = {
        children: PropTypes.node.isRequired,
        plugins: PropTypes.arrayOf(PropTypes.instanceOf(PluginContainer)),
        renderer: PropTypes.instanceOf(AstRenderer),
        style: PropTypes.object,
    };

    /**
     * Default Props
     */
    static defaultProps = {
        plugins: [],
        renderer: new AstRenderer(defaultRenderFunctions),
        style: {}
    };

    copy = '';
    markdown;

    /**
     * Only when the copy changes will the markdown render again.
     * @param nextProps
     * @param nextState
     * @return {boolean}
     */
    shouldComponentUpdate (nextProps, nextState) {
        const copy = nextProps.children instanceof Array
            ? nextProps.children.join('')
            : nextProps.children;

        if (copy !== this.copy) {
            this.copy = copy;
            return true;
        }

        return false;
    }

    componentWillMount () {
        if (this.props.plugins && this.props.plugins.length > 0 && !this.markdown) {
            let md = MarkdownIt();

            this.props.plugins.forEach(plugin => {
                md = md.use.apply(md, plugin.toArray());
            });

            this.markdown = md;
        }
    }

    getCopyFromProps () {
        return this.props.children instanceof Array
            ? this.props.children.join('')
            : this.props.children;
    }

    /**
     *
     * @return {View}
     */
    render () {
        const copy = (this.copy = this.getCopyFromProps());
        const markdown = this.markdown || MarkdownIt();
        const {renderer, style} = this.props;

        return parser(copy, renderer, markdown, style);
    }
}
