const React = require('react-native')
const {StyleSheet, Dimensions} = React

import { COLORS, LIGHT_COLORS, DARK_COLORS, FONTS, FONT_SIZES, ALIGNMENTS, MARGINS, HEIGHTS } from '../../assets/constants.js';
import { Appearance } from 'react-native'
const top_margin = MARGINS.NORMAL_HEADER_MARGINS
const {height, width} = Dimensions.get('window');
const THEME = Appearance.getColorScheme() === 'light' ? LIGHT_COLORS : DARK_COLORS

const styles = StyleSheet.create({
    container: {
      flexDirection: ALIGNMENTS.ROW,
      justifyContent: ALIGNMENTS.SPACE_BETWEEN,
      alignItems: ALIGNMENTS.CENTER,
      height: HEIGHTS.APP_HEADER,
      backgroundColor: THEME.BACKGROUND,
      borderBottomColor: COLORS.LIGHT_GRAY,
      borderBottomWidth: 1,
      color: THEME.LABEL
    },
    leftButton: {
      width: 56,
      paddingLeft: 16,
      paddingRight: 16,
      //marginTop: MARGINS.DEFAULT_MARGIN,
      color: THEME.LABEL
    },
    title: {
      width: width >= 375 ? 243 : 200,
      height: 26,
    },
    wordsTitle: {
      color: THEME.LABEL,
      fontFamily: FONTS.PT_SERIF_BOLD,
      fontSize: FONT_SIZES.DEFAULT_SMALL_MEDIUM,
      textAlign: ALIGNMENTS.CENTER
    },
    rightButton: {
      width: 56,
      paddingRight: 16,
      paddingLeft: 16,
      //marginTop: MARGINS.DEFAULT_MARGIN,
      color: THEME.LABEL
    },
    profileImage: {
      tintColor: COLORS.WHITE,
      width: 20,
      height: 23
    },
    textInput: {
      fontFamily: FONTS.HNEUE,
      fontSize: 14,
      width: '90%',
      height: 26,
      color: COLORS.BLACK,
      borderRadius: 6,
      paddingLeft: MARGINS.DEFAULT_MARGIN,
      paddingRight: MARGINS.DEFAULT_MARGIN,
    },
    searchContainer: {
      width: width*4/5,
      backgroundColor: THEME.BACKGROUND
    },
    textInputWrapper: {
      flexDirection: ALIGNMENTS.ROW,
      justifyContent: ALIGNMENTS.CENTER,
      alignItems: ALIGNMENTS.CENTER,
      width: '80%',
      height: 28,
      borderWidth: 1,
      borderRadius: 6,
    }
})

module.exports = styles
