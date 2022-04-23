import React, { useEffect, useRef, useState } from 'react';

import { classNames, parseBgClassNames } from '@utils/classname-utils';
import BarWrapper from '@common/BarWrapper';
import Trapezoid from '@common/Trapzoid';

export interface FunnelBarsProps {
    widthPercentageList: number[],
    funnelColor?: string,
    funnelPixelHeight?: number
    primaryBarBgColor?: string,
    secondaryBarBgColor?: string,
}

const FunnelBars = ({
    widthPercentageList,
    funnelPixelHeight = 70,
    funnelColor = 'text-gray-100',
    primaryBarBgColor = 'bg-gray-400',
    secondaryBarBgColor = 'bg-gray-100',
}: FunnelBarsProps) => {

    const getRefPixelWidth = (refElement: React.RefObject<HTMLDivElement>): number => {
        return refElement.current ? refElement.current.offsetWidth : 0;
    };

    const barWrapperWidthRef = useRef<HTMLDivElement>(null);
    const [barWrapperWidth, setBarWrapperWidth] = useState(getRefPixelWidth(barWrapperWidthRef));

    const handleWindowResize = (): void => {
        setBarWrapperWidth(getRefPixelWidth(barWrapperWidthRef));
    };

    useEffect(() => {
        handleWindowResize();
        window.addEventListener('resize', handleWindowResize);
        return () => {
            document.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    return(
        <div ref={ barWrapperWidthRef }>
            { widthPercentageList?.map((widthPercentage, idx) => {
                const currentWidthPercentage: number = widthPercentage;
                const nextWithPercentage: number = idx!=widthPercentageList.length - 1
                    ? widthPercentageList[idx + 1]
                    : -1;

                return(
                    <React.Fragment key={idx}>
                        <BarWrapper
                            bgColor={ secondaryBarBgColor }
                            addClassNames={'justify-center'}
                        >
                            <div 
                                className={ classNames(
                                    parseBgClassNames(primaryBarBgColor),
                                    'h-full rounded'
                                ) }
                                style={ {'width': `${currentWidthPercentage}%`} } />
                        </BarWrapper>
                        {idx!=widthPercentageList.length - 1 ? (
                            <div className="flex justify-center">
                                <Trapezoid
                                    wrapperPixelWidth={ barWrapperWidth }
                                    topWidthPercentage={ currentWidthPercentage }
                                    bottomWidthPercentage = {nextWithPercentage}
                                    pixelHeight = { funnelPixelHeight }
                                    textColor = { funnelColor }
                                />
                            </div>    
                        ) : null}
                    </React.Fragment>
                );
            }) }
        </div>
    );
};

export default FunnelBars;