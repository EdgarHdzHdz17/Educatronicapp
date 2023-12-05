// SVGSimulation.js
import React from 'react';
import { Svg, Path } from 'react-native-svg';

//Componente SVG Simulacion
function SVGSimulation({ pathWidth, pathHeight,levelXElevator,statusDoor}) {

    //Componentes del edificio
    const widthBuild = pathWidth * 0.5; // Ancho del edificio
    const heightBuild = pathHeight * 1 ; // Alto del edificio
  
    const widthWindow = widthBuild * 0.3; // Ancho de la ventana
    const heightWindow = heightBuild * 0.09;// Alto de la ventana
  
    const widthWindowLevel1 = widthBuild * 0.15; // Ancho de la ventana del nivel 1
    const heightWindowLevel1 = heightBuild * 0.15;// Alto de la ventana del nivel 1
  
    const heightDoorLevel1= heightBuild * 0.25;// Alto de la puerta del nivel 1
    const widthDoorLevel1 = widthBuild * 0.15; // Ancho de la puerta del nivel 1
  
    const window1PositionX = ((widthBuild - widthWindow) / 2) - (widthBuild * 0.20);//Posicion de las ventanas izquierdas en X
    const window2PositionX = ((widthBuild + widthWindow) / 2) - (widthBuild * 0.10);//Posicion de las ventanas derechas en X
  
    const door1PositionX = ((widthBuild - widthWindow) / 2) - (widthBuild * 0.01);//Posicion de la puerta izquierda en X
    const door2PositionX = ((widthBuild + widthWindow) / 2) - (widthBuild * 0.15);//Posicion de la puerta derecha en X
  
    const window1Level1PositionX = ((widthBuild - widthWindow) / 2) - (widthBuild * 0.25);//Posicion de la ventana izquierda del nivel 1 en X
    const window2Level1PositionX = ((widthBuild + widthWindow) / 2) - (widthBuild * -0.10);//Posicion de la ventana derecha del nivel 1 en X
  
    const windowsLevel1PositionY =  heightBuild * 0.80; // 65%
  
    //Posicion de las ventanas dentro del edificio
    const windowLevel7 = heightBuild * 0.10; // 10%
    const windowLevel6 = heightBuild * 0.20; // 20% 
    const windowLevel5 = heightBuild * 0.30; // 30% 
    const windowLevel4 = heightBuild * 0.40; // 40% 
    const windowLevel3 = heightBuild * 0.50; // 50% 
    const windowLevel2 = heightBuild * 0.60; // 60% 
    const windowLevel1 = heightBuild * 0.74; // 74%
  
    //Componentes del elevador
    const widthElevator = pathWidth * 0.15; // Ancho del elevador
    const heightElevator = pathHeight * 0.2 ; // Alto del elevador 
  
    const PositionXElevator = (pathWidth-widthBuild*0.6)//Posicion del elevador en el eje X
  
    const heightDoorElevator= heightElevator * 0.85;// Alto de la puerta del elevador
    const widthDoorElevator = widthElevator * 0.60; // Ancho de la puerta del elevador
  
    const halfElevatorHeight = heightElevator * 0.5;//Calcula la mitad de la altura del elevador
  
    const doorPositionYElevator = levelXElevator - (halfElevatorHeight * -0.30);//La posicion en Y de la puerta del elevador se desplaza cada que cambia la posicion el elevador
  
    //Componentes del marco de la puerta
    const heightFrameDoorElevator= heightElevator * 0.88;// Alto del contorno de la puerta
    const widthFrameDoorElevator = widthElevator * 0.70; // Ancho del contorno de la puerta
    const positionFrameDoor = (pathWidth-widthBuild*0.555)//Posicion del marco de la puerta en X
    const doorFramePositionYElevator = levelXElevator - (halfElevatorHeight * -0.23);////Posicion del marco en Y
  
    //Componentes del indicador del elevador
    const heightIndicatorElevator= heightElevator * 0.08;// Alto del indicador de la puerta
    const widthIndicatorElevator = widthElevator * 0.50; // Ancho del indicador de la puerta
    const positionIndicatorElevator = (pathWidth-widthBuild*0.52)//Posicion del indicador de la puerta en X
    const indicatorPositionYElevator = levelXElevator - (halfElevatorHeight * -0.03);//Posicion del indicador en Y
  
    //Componentes del control del elevador
    const heightControlElevator= heightElevator * 0.08;// Alto del control de la puerta
    const widthControlElevator = widthElevator * 0.08; // Ancho del control de la puerta
    const positionControlElevator = (pathWidth-widthBuild*0.335)//Posicion del control de la puerta en X
    const controlPositionYElevator = levelXElevator - (halfElevatorHeight * -0.99);////Posicion del control en Y
    
    return (
      <Svg xmlns="http://www.w3.org/2000/svg" width={pathWidth} height={pathHeight} fill="none">
        <Path fill="#F2994A" d={`M0 0h${widthBuild}v${heightBuild}H0z`}/*Build*/ />
        <Path fill="#cd853f" d={`M${PositionXElevator} ${levelXElevator}h${widthElevator}v${heightElevator}H${PositionXElevator}z`}/*Elevator*/ />
        <Path fill="#a9a9a9" d={`M${positionFrameDoor} ${doorFramePositionYElevator}h${widthFrameDoorElevator}v${heightFrameDoorElevator}H${positionFrameDoor}z`}/*Mark*/ />
        <Path fill="#a9a9a9" d={`M${positionIndicatorElevator} ${indicatorPositionYElevator}h${widthIndicatorElevator}v${heightIndicatorElevator}H${positionIndicatorElevator}z`}/*Indicator*/ />
        <Path fill="#a9a9a9" d={`M${positionControlElevator} ${controlPositionYElevator}h${widthControlElevator}v${heightControlElevator}H${positionControlElevator}z`}/*Control*/ />
        <Path fill="#8b4513" d={`M${statusDoor} ${doorPositionYElevator}h${widthDoorElevator}v${heightDoorElevator}H${statusDoor}z`}/*Door*/ />
        <Path fill="#C5E4F9" d={`M${window1PositionX} ${windowLevel7}h${widthWindow}v${heightWindow}H${window1PositionX}z`}/*Level 7*/ />
        <Path fill="#C5E4F9" d={`M${window2PositionX} ${windowLevel7}h${widthWindow}v${heightWindow}H${window2PositionX}z`}/*Level 7*/ />
        <Path fill="#C5E4F9" d={`M${window1PositionX} ${windowLevel6}h${widthWindow}v${heightWindow}H${window1PositionX}z`}/*Level 6*/ />
        <Path fill="#C5E4F9" d={`M${window2PositionX} ${windowLevel6}h${widthWindow}v${heightWindow}H${window2PositionX}z`}/*Level 6*/ />
        <Path fill="#C5E4F9" d={`M${window1PositionX} ${windowLevel5}h${widthWindow}v${heightWindow}H${window1PositionX}z`}/*Level 5*/ />
        <Path fill="#C5E4F9" d={`M${window2PositionX} ${windowLevel5}h${widthWindow}v${heightWindow}H${window2PositionX}z`}/*Level 5*/ />
        <Path fill="#C5E4F9" d={`M${window1PositionX} ${windowLevel4}h${widthWindow}v${heightWindow}H${window1PositionX}z`}/*Level 4*/ />
        <Path fill="#C5E4F9" d={`M${window2PositionX} ${windowLevel4}h${widthWindow}v${heightWindow}H${window2PositionX}z`}/*Level 4*/ />
        <Path fill="#C5E4F9" d={`M${window1PositionX} ${windowLevel3}h${widthWindow}v${heightWindow}H${window1PositionX}z`}/*Level 3*/ />
        <Path fill="#C5E4F9" d={`M${window2PositionX} ${windowLevel3}h${widthWindow}v${heightWindow}H${window2PositionX}z`}/*Level 3*/ />
        <Path fill="#C5E4F9" d={`M${window1PositionX} ${windowLevel2}h${widthWindow}v${heightWindow}H${window1PositionX}z`}/*Level 2*/ />
        <Path fill="#C5E4F9" d={`M${window2PositionX} ${windowLevel2}h${widthWindow}v${heightWindow}H${window2PositionX}z`}/*Level 2*/ />
        <Path fill="#C5E4F9" d={`M${door1PositionX} ${windowLevel1}h${widthDoorLevel1}v${heightDoorLevel1}H${door1PositionX}z`}/*Level 1*//>
        <Path fill="#C5E4F9" d={`M${door2PositionX} ${windowLevel1}h${widthDoorLevel1}v${heightDoorLevel1}H${door2PositionX}z`}/*Level 1*/ />
        <Path fill="#C5E4F9" d={`M${window1Level1PositionX} ${windowsLevel1PositionY}h${widthWindowLevel1}v${heightWindowLevel1}H${window1Level1PositionX}z`}/*Level 1*//>
        <Path fill="#C5E4F9" d={`M${window2Level1PositionX} ${windowsLevel1PositionY}h${widthWindowLevel1}v${heightWindowLevel1}H${window2Level1PositionX}z`}/*Level 1*//>
      </Svg>
    );
  }


  export default SVGSimulation;