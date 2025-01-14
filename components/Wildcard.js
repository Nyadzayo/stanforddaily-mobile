import React, { useContext, useEffect } from "react"
import { Dimensions, StyleSheet, PixelRatio, View } from "react-native"
import { Button, Card, Text } from "@ui-kitten/components"
import { Image } from "react-native"
import _ from "lodash"
import { decode } from "html-entities"
import { ThemeContext } from "../theme-context"
import { formatDate, itemize } from "../helpers/format"
import { deviceType } from "../App"
import * as Device from "expo-device"

const { width, height } = Dimensions.get("window")
const pixelRatio = PixelRatio.get()

export default function Wlidcard(props) {
    const { navigation, articles, random, verbose, title, item, index } = props
    
    const Header = (props) => (
        <React.Fragment>
            <View>
                <Text style={styles.header} category="h6">{props.title}</Text>
                {verbose && (<Text category="p2" style={styles.date}>{formatDate(new Date(props.date))}</Text>)}
            </View>
            
            <Image
                source={{ uri: `${props.uri}?w=${width*pixelRatio/(deviceType() === Device.DeviceType.PHONE ? 1 : 2)}` }}
                style={{ flex: 1, height: 192 }}
            />
        </React.Fragment>
    )

    const Footer = (props) => (
        <View style={styles.footer}>
            <Text style={{ textAlign: "left", flex: 0.95 }} category="label">{props.byline}</Text>
            <Button size="tiny" status="basic">{decode(props.section).replace('\'', '\u{2019}')}</Button>
        </View>
    )
    
    return (
        <Card
            style={styles.card}
            header={<Header title={decode(item.title.rendered)} date={item.date} uri={item["jetpack_featured_media_url"]}/>}
            footer={<Footer byline={itemize(item.parsely?.meta?.creator?.map(name => name.toUpperCase()))} section={item.parsely?.meta?.articleSection}/>}
            {...{...props, onPress: () => navigation.push("Post", { article: item, sourceName: title })}}
        >
            <Text style={{ marginHorizontal: -4 }}>{decode(item.excerpt.rendered.slice(3, -5))}</Text>
        </Card>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    date: {
        paddingHorizontal: 20,
        paddingTop: 0,
        paddingBottom: 10,
        fontFamily: undefined,
        fontWeight: "bold"
    },
    card: {
        flex: 1,
        marginHorizontal: 8,
        marginVertical: 4
    },
    container: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 4
    }
})