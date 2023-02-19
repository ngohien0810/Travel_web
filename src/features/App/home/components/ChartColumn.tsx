import { Bar } from '@ant-design/plots';
import React from 'react';
import { homeService } from '../service';

const ChartColumn = () => {
    const [reports, setReports] = React.useState<any>([]);

    const convertData = reports.map((item: any) => {
        return {
            tour: item.Code,
            value: item?.feedbacks?.length,
        };
    });

    const config: any = {
        data: convertData,
        xField: 'value',
        yField: 'tour',
        seriesField: 'value',
        legend: {
            position: 'bottom',
        },
    };

    React.useEffect(() => {
        homeService.getReportTourByFeed().then((res) => {
            setReports(res);
        });
    }, []);

    return <Bar appendPadding={[20, 0]} {...config} />;
};

export default React.memo(ChartColumn);
