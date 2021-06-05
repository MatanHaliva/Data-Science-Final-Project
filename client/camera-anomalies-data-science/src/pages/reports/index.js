import { Fragment, useEffect } from "react"
import * as React from "react"
import Layout from "../components/Layout"
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
} from '@devexpress/dx-react-chart-material-ui';

import PieChart, {
    Series,
    Label,
    Connector,
    Size,
    Export
  } from 'devextreme-react/pie-chart';

import { areas } from './data.js';


const Reports = () => {
    useEffect(() => {

    }, [])

    const data = [
        { argument: 1, value: 10 },
        { argument: 2, value: 20 },
        { argument: 3, value: 30 },
      ];
      

    const pointClickHandler = (e) => {
        toggleVisibility(e.target);
    }
    
    const legendClickHandler = (e) =>  {
        let arg = e.target;
        let item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];
    
        toggleVisibility(item);
    }
    
    const toggleVisibility = (item) => {
        item.isVisible() ? item.hide() : item.show();
    }

    return (
        <Layout>
            <div className="background-white charts-container-row">
                <div class="row1 charts-container-col">
                    <div class="col1">
                        <h2>License Detections Distribution Over Time:</h2>
                            <Chart
                        data={data}
                        >
                            <ArgumentAxis />
                            <ValueAxis />

                            <LineSeries valueField="value" argumentField="argument" />
                        </Chart>
                    </div>
                    <div class="col2">
                        <h2>Detections Distribution Over Time:</h2>
                        <PieChart
                            id="pie"
                            dataSource={areas}
                            palette="Bright"
                            title="Area of Countries"
                            onPointClick={pointClickHandler}
                            onLegendClick={legendClickHandler}
                        >
                            <Series
                            argumentField="country"
                            valueField="area"
                            >
                            <Label visible={true}>
                                <Connector visible={true} width={1} />
                            </Label>
                            </Series>

                            <Size width={500} />
                            <Export enabled={true} />
                        </PieChart>
                    </div>
                </div>
                <div class="row2">
                <Chart
                data={data}
                >
                    <ArgumentAxis />
                    <ValueAxis />

                    <LineSeries valueField="value" argumentField="argument" />
                </Chart>
                </div>
            
            </div>
        </Layout>
    )
}


export default Reports