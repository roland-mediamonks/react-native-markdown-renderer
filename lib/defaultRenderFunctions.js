import React, { Component, PropTypes } from 'react';
import { Text, View } from 'react-native';

import FitImage from 'react-native-fit-image';
import { markdownStyles } from './style';
import AstRenderer from './AstRenderer';





const defaultRenderFunctions = {
  // when unknown elements are introduced, so it wont break
  unknown: (node, children) => {
    return (
      <View key={AstRenderer.getUniqueID()}>
        {children}
      </View>
    );
  },

  // `root` is a special case.
  root: children =>
    <View key={AstRenderer.getUniqueID()}>
      {children}
    </View>,
  text: (node, children, parents) => {
    return (
      <Text key={AstRenderer.getUniqueID()} style={markdownStyles.text}>
        {node.content}
      </Text>
    );
  },
  span: (node, children) =>
    <Text key={AstRenderer.getUniqueID()}>
      {children}
    </Text>,

  strong: (node, children, parents) => {
    return (
      <Text key={AstRenderer.getUniqueID()} style={[markdownStyles.strong]}>
        {children}
      </Text>
    );
  },

  s: (node, children) => {
    return (
      <Text key={AstRenderer.getUniqueID()} style={markdownStyles.strikethrough}>
        {children}
      </Text>
    );
  },
  a: (node, children) => {
    return (
      <Text key={AstRenderer.getUniqueID()} style={markdownStyles.a} onPress={() => AstRenderer.openUrl(node.attributes.href)}>
        {children}
      </Text>
    );
  },
  em: (node, children, parents) => {
    if (AstRenderer.hasParents(parents, 'ICONLIST')) {
      return (
        <Text key={AstRenderer.getUniqueID()} style={markdownStyles.icon}>
          {children}
        </Text>
      );
    }

    return (
      <Text key={AstRenderer.getUniqueID()} style={markdownStyles.em}>
        {children}
      </Text>
    );
  },
  CHECKLIST: (node, children) => {
    return (
      <View key={AstRenderer.getUniqueID()}>
        {children}
      </View>
    );
  },
  ICONLIST: (node, children) => {
    return (
      <View key={AstRenderer.getUniqueID()}>
        {children}
      </View>
    );
  },

  h1: (node, children) =>
    <Text key={AstRenderer.getUniqueID()} style={[markdownStyles.heading, markdownStyles.heading1]}>
      {children}
    </Text>,
  h2: (node, children) =>
    <Text key={AstRenderer.getUniqueID()} style={[markdownStyles.heading, markdownStyles.heading2]}>
      {children}
    </Text>,
  h3: (node, children) =>
    <Text key={AstRenderer.getUniqueID()} style={[markdownStyles.heading, markdownStyles.heading3]}>
      {children}
    </Text>,
  h4: (node, children) =>
    <Text key={AstRenderer.getUniqueID()} style={[markdownStyles.heading, markdownStyles.heading4]}>
      {children}
    </Text>,
  h5: (node, children) =>
    <Text key={AstRenderer.getUniqueID()} style={[markdownStyles.heading, markdownStyles.heading5]}>
      {children}
    </Text>,
  h6: (node, children) =>
    <Text key={AstRenderer.getUniqueID()} style={[markdownStyles.heading, markdownStyles.heading6]}>
      {children}
    </Text>,

  p: (node, children) =>
    <View key={AstRenderer.getUniqueID()} style={markdownStyles.paragraph}>
      {children}
    </View>,

  blockquote: (node, children) =>
    <View key={AstRenderer.getUniqueID()} style={markdownStyles.blockquote} >
      {children}
    </View>,
  code: (node, children) =>
    <View key={AstRenderer.getUniqueID()} style={markdownStyles.code} >
      {children}
    </View>,
  pre: (node, children) =>
    <View key={AstRenderer.getUniqueID()} style={markdownStyles.pre} >
      {children}
    </View>,
  ul: (node, children) => {
    return (
      <View key={AstRenderer.getUniqueID()} style={[markdownStyles.list, markdownStyles.listUnordered]}>
        {children}
      </View>
    );
  },
  ol: (node, children) => {
    return (
      <View key={AstRenderer.getUniqueID()} style={[markdownStyles.list, markdownStyles.listOrdered]}>
        {children}
      </View>
    );
  },
  li: (node, children, parents) => {
    if (AstRenderer.hasParents(parents, 'ul')) {
      return (
        <View key={AstRenderer.getUniqueID()} style={markdownStyles.listUnorderedItem}>
          <Text style={{ marginLeft: -10, marginRight: 10, lineHeight: 40 }}>
            {'\u00B7'}
          </Text>
          <View style={[markdownStyles.listItem]}>
            {children}
          </View>
        </View>
      );
    }

    if (AstRenderer.hasParents(parents, 'ol')) {
      return (
        <View key={AstRenderer.getUniqueID()} style={{ flexDirection: 'row' }}>
          <Text style={{ width: 20, lineHeight: 40 }}>
            {node.index + 1}
          </Text>
          <View style={[markdownStyles.listItem]}>
            {children}
          </View>
        </View>
      );
    }

    return (
      <View key={AstRenderer.getUniqueID()} style={[markdownStyles.listItem]}>
        {children}
      </View>
    );
  },
  table: (node, children) =>
    <View key={AstRenderer.getUniqueID()} style={[markdownStyles.table]}>
      {children}
    </View>,
  thead: (node, children) =>
    <View key={AstRenderer.getUniqueID()} style={[markdownStyles.tableHeader]}>
      {children}
    </View>,
  tbody: (node, children) =>
    <View key={AstRenderer.getUniqueID()}>
      {children}
    </View>,
  th: (node, children) => {
    return (
      <View key={AstRenderer.getUniqueID()} style={[markdownStyles.tableHeaderCell]}>
        {children}
      </View>
    );
  },
  tr: (node, children, parents) => {
    return (
      <View key={AstRenderer.getUniqueID()} style={[markdownStyles.tableRow]}>
        {children}
      </View>
    );
  },
  td: (node, children, parents) => {
    return (
      <View key={AstRenderer.getUniqueID()} style={[markdownStyles.tableRowCell]}>
        {children}
      </View>
    );
  },
  hr: (node, children) => {
    return <View key={AstRenderer.getUniqueID()} style={[markdownStyles.hr]} />;
  },
  br: (node, children) =>
    <Text key={AstRenderer.getUniqueID()}>
      {'\n'}
    </Text>,
  img: (node, children) => {
    return <FitImage key={AstRenderer.getUniqueID()} source={{ uri: node.attributes.src }} />;
  },
};

export default defaultRenderFunctions;
