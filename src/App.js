
import React, {Component} from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import './css/App.css';
import './css/conponents.css';
import './css/tooltip.css';
import './bdcgin/css/footer.css';

import {game_name, social_links, support} from './game/core/app_config';
import {getDefaultState} from './game/core/default_state';
import {rules} from './game/core/rules';
import { Gin } from "./bdcgin/Gin";
import GinGameMenu from './bdcgin/GinGameMenu';
import GinFooter from './bdcgin/GinFooter';
import Helpers from "./game/Helpers";

import {isEnough, chargeCost} from './bdcgin/Gin';
import {constructions} from './gamedata/constructions';
import {workers} from './gamedata/workers';

class App extends Component {
    constructor(props) {
        super(props);

        this.gin = new Gin(game_name, getDefaultState);
        //this.gin.addViewHandler(state => { console.log(state, this, this.setState); this.setState(state); });
        this.gin.connectReact(this);
        this.gin.registerRules(rules);
        this.state = getDefaultState();
    }

    componentDidMount() {
        this.gin.loadGame('FirstSave');
        this.gin.playGame();
    }


    render() {
        const state = this.state;

        const GinButton = (props) => {
            let item = props.item;
            return (item.isLocked && item.isLocked(this.state))
                ? ''
                :
                <button
                        className={
                            (item.isDisabled && item.isDisabled(this.state)) ? 'disabled' :
                                (item.cost ? isEnough(this.state, item.cost) ? '' : 'disabled' : '')
                        }
                        onClick={() => { this.gin.onClick(item); }}>
                    {item.name}
                </button>
        };

        const BuyGinButton = (props) => <GinButton item={{
            name: "$ " + props.item.cost.money,
            cost: props.item.cost,
            isDisabled: (state) => props.item.isDisabled(state),
            onClick: (state) => props.item.onClick(state)
        }} />;

        const HireGinButton = (props) => <GinButton item={{
            name: "Hire",
            isDisabled: (state) => props.item.isDisabled(state),
            onClick: (state) => props.item.onClick(state)
        }} />;

        const FireGinButton = (props) => <GinButton item={{
            name: "Fire",
            isDisabled: (state) => props.item.isDisabled(state),
            onClick: (state) => props.item.onClick(state)
        }} />;


        let constructionBox = (item, key) =>
            <div key={item.key} className={item.key + " box smallBorders background"}>
                <div className="box">
                    <div> { item.name }: <BuyGinButton item={item}/>
                    </div>
                    <div className="flex-container-column">
                        <div className="flex-element">
                            Queue: {state.queue[item.key].length}
                        </div>
                        <div className="flex-element">
                            Load:
                            {state.processing[item.key].length}/
                            { item.bandwidth * state.constructions[item.key] } (
                            { item.bandwidth }×{ state.constructions[item.key] })
                        </div>
                    </div>
                </div>
            </div>;

        return (
            <div className="App">
                <div id="container">
                    <div className="flex-container-column">
                        <div className="box">
                            <div>
                                Hour: {state.tick} Minutes: {state.frame}
                            </div>
                            <div> Game speed:
                                <GinGameMenu state={state} gin={this.gin} speeds={[1, 3, 24]} />
                            </div>
                        </div>

                        {constructionBox(constructions.luggageCart)}
                        {constructionBox(constructions.dutyFree)}
                        {constructionBox(constructions.escalator)}
                        {constructionBox(constructions.fastRoad)}
                        {constructionBox(constructions.checkIn)}

                        <div className="box"></div>
                    </div>

                    <div className="wide fat">
                        <div className="box">
                            {constructionBox(constructions.runway)}
                        </div>
                        <div className="splitOnTwoSides">
                            {constructionBox(constructions.bus)}
                        </div>
                        <div className="splitOnTwoSides">
                            {constructionBox(constructions.passport)}
                        </div>
                        <div className="splitOnTwoSides">
                            {constructionBox(constructions.security)}
                        </div>
                        <div className="box">
                            {constructionBox(constructions.hall)}
                        </div>
                        <div className="splitOnTwoSides">
                            {constructionBox(constructions.rail)}
                            {constructionBox(constructions.parking)}
                        </div>
                    </div>

                    <div className="flex-container-column">
                        <div className="box">
                            <div>Money: ${state.money}</div>
                            <div className="box smallBorders background">Workers: {state.workers.length}
                                <div className="center">
                                    <div className="fat"><HireGinButton item={workers.hire}/></div>
                                    <div className="fat"><FireGinButton item={workers.fire}/></div>
                                </div>
                            </div>
                        </div>
                        {constructionBox(constructions.luggageLine)}
                        {constructionBox(constructions.hotel)}

                        <div className="box"></div>
                    </div>
                </div>

                <GinFooter state={state} gin={this.gin} social_links={social_links} support={support}/>

            </div>
        );
    }
}

export default App;
