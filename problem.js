import React, {useEffect, useState, useContext, useRef, useCallback} from 'react';
import {
    View,
    Text,
    Dimensions,
    FlatList,
} from 'react-native';

import produce from 'immer'


export default function Slider(){
    const {width, height} = Dimensions.get('window')
    const flatRef = useRef()
    const [data, setData] = useState([
        {
            id: -2,
            no: 'screen-2'
        },
        {
            id: -1,
            no: 'screen-1'
        },
        {
            id: 0,
            no: 'screen0'
        },
        {
            id: 1,
            no: 'screen1'
        },
        {
            id: 2,
            no: 'screen2'
        }
    ])

    const viewConfigRef = useRef({
        viewAreaCoveragePercentThreshold: 100,
        waitForInteraction: true
    })

    const changeData = useCallback(({changed, viewableItems}) => {

        setData((oldState) => {
            //add data when view stop, viewable items is first one
            if(viewableItems.length === 1 && viewableItems[0].index === 1) {
                var newData = produce(oldState, draft => {
                    draft.unshift({
                        id: oldState[0].id -1,
                        no: 'screen' + (oldState[0].id -1).toString()
                    })
                })
                return newData
            } 
            //add data when view stop, viewable items is last one
            else if(viewableItems.length === 1 && viewableItems[0].index === oldState.length-1) {
                var newData = produce(oldState, draft => {
                    draft.push({
                        id: oldState[oldState.length-1].id +1,
                        no: 'screen' + (oldState[oldState.length-1].id +1).toString()
                    })
                })
                return newData
            } 
            //return oldState
            else {
                console.log('return oldState')
                return oldState
            }
        })
    }, [])

    
    function _renderItem({item}){
        return(
            <View style={[{width: width, height: height} ]} key={item.id}>
                <Text style={{fontSize: 48}}>{item.no}</Text>
            </View>
        )
    }


    return(
        <FlatList
        ref={flatRef}
        style={{
            flexGrow: 1
        }}
        data={data}
        renderItem={_renderItem}
        horizontal={true}
        pagingEnabled
        showsHorizontalScrollIndicator={true}
        keyExtractor={item => item.id.toString()}
        initialScrollIndex={2}
        viewabilityConfig={viewConfigRef.current}
        onViewableItemsChanged={changeData}
        />
    )
}
