import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native-animatable'
import { window } from '../assets'
import IOS from '../assets/platform'
import * as r from '../styles/rinc'

class Rainbow extends Component { 

    render() {
        const loading = this.props.loading
        return (
            <View 
                style={[r.f, r.row, r.center, { height: IOS ? 2 : 4 }]}
                animation={loading ? wrapperAnimStart : wrapperAnimEnd}
                duration={500}
                easing={'ease-in-out-cubic'}
                useNativeDriver
            >
                <Item loading={loading} color={'#BB0022'} />
                <Item loading={loading} color={'#20964D'} delay={50} duration={1250} />
                <Item loading={loading} color={'#A0A02C'} delay={110} duration={1300} />
                <Item loading={loading} color={'#F79F3F'} delay={150} duration={1350} />
                <Item loading={loading} color={'#EF6139'} delay={200} duration={1400} />
                <Item loading={loading} color={'#FE0002'} delay={250} duration={1450} />
                <Item color={'#FE0002'} last /> 
                {/* for an unknowen reason the last item moves infinitely at homePage!! so this 1 pixel width View handles that! */}

            </View>
        )
    }
}

const mapStateToProps = state => ({ loading: state.loading })
export default connect(mapStateToProps)(Rainbow)


let timeout
class Item extends Component {
    state = { animate: true }
    componentDidMount() {
        this.handleAnimate()
    }
    handleAnimate = () => {
        timeout = setTimeout(() => {
            if(!this.props.loading) this.setState({ animate: false })
        }, 1300)
    }
    componentWillUnmount() {
        clearTimeout(timeout)
    }
    render () {
        const { color, duration = 1200, delay = 0 } = this.props
        if(this.props.last) {
            return <View style={[r.hFull, { width: 1, backgroundColor: color }]} />
        }
        return (
            <View
                ref = {ref => this.View = ref}
                style={[r.hFull, { width: window.width / 6, backgroundColor: color }]} 
                animation={this.state.animate ? itemAnim : null }
                duration={duration} 
                iterationCount={'infinite'}
                easing={'ease-in-out-cubic'}
                delay={delay}
                useNativeDriver
            />
        )
    }
}

const wrapperAnimStart = {
    from: { transform: [{ scaleY: 1 }] },
    to: { transform: [{ scaleY: 1.4 }] }
}

const wrapperAnimEnd = {
    from: { transform: [{ scaleY: 1.4 }] },
    to: { transform: [{ scaleY: 1 }] }
}

const itemAnim = {
    0: { transform: [{ scaleX: 1 }] },
    0.5: { transform: [{ scaleX: 1.8 }] },
    1: { transform: [{ scaleX: 1 }] }
}
