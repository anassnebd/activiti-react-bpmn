import React, { Component } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-font/dist/css/bpmn-embedded.css";
import { emptyBpmn } from "./asset/empty.bpmn";
import propertiesPanelModule from "bpmn-js-properties-panel-activiti";
import propertiesProviderModule from "bpmn-js-properties-panel-activiti/lib/provider/activiti";
import activitiModdleDescriptor from "activiti-bpmn-moddle/resources/activiti";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";
import { Button } from "react-bootstrap";
import EditMenuBar from "./EditMenuBar";


class BpmnEditor extends Component {
  // modeler = null;
  constructor(props) {
    super(props);
    this.bpmnContainerRef = React.createRef(); 
    this.modeler = null; 
  }

  setEncoded = (link, name, data) => {
    var encodedData = encodeURIComponent(data);

    console.log(encodedData);

    if (data) {
      link.href = "data:application/bpmn20-xml;charset=UTF-8," + encodedData;
      link.setAttribute("download", name);
    }
  };

  // exportDiagramActivitiBpmn = async () => {
  //   try {
  //     if (!this.modeler) {
  //       console.error('BPMN modeler instance is not initialized.');
  //       return;
  //     }
    
  //     const xml = await this.modeler.saveXML({ format: true, moddleOptions: { format: true, preamble: true },  });
    
  //     if (!xml || !xml.xml) {
  //       console.error('Failed to obtain BPMN XML.');
  //       return;
  //     }
    
  //     const blob = new Blob([xml.xml], { type: 'application/xml' });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'diagram.bpmn';
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error('Failed to export diagram:', error);
  //   }
  // };
  
  


  componentDidMount = () => {
    this.modeler = new BpmnModeler({
      container: "#bpmnview",
      keyboard: {
        bindTo: window
      },
      propertiesPanel: {
        parent: "#propview"
      },
      additionalModules: [propertiesPanelModule, propertiesProviderModule],
      moddleExtensions: {
        activiti: activitiModdleDescriptor 
    }
    });
    

    this.newBpmnDiagram();
  };

  newBpmnDiagram = () => {
    const emptyXml = '<?xml version="1.0" encoding="UTF-8"?>' +
                     '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                     'xmlns:activiti="http://activiti.org/bpmn" id="Definitions_1">' +
                     '  <bpmn:process id="Process_1" isExecutable="true">' +
                     '    <bpmn:startEvent id="StartEvent_1">' +
                     '      <bpmn:outgoing>Flow_1</bpmn:outgoing>' +
                     '    </bpmn:startEvent>' +
                     '    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="EndEvent_1"/>' +
                     '    <bpmn:endEvent id="EndEvent_1">' +
                     '      <bpmn:incoming>Flow_1</bpmn:incoming>' +
                     '    </bpmn:endEvent>' +
                     '  </bpmn:process>' +
                     '</bpmn:definitions>';
    this.openBpmnDiagram(emptyXml);
  };
      
  // newBpmnDiagram = () => {
  //   this.openBpmnDiagram(emptyBpmn);
  // };

  openBpmnDiagram = (xml) => {
    this.modeler.importXML(xml, (error) => {
      if (error) {
        return console.log("fail import xml");
      }

      var canvas = this.modeler.get("canvas");

      canvas.zoom("fit-viewport");
    });
  };

  exportDiagramActivitiBpmn = async () => {
    try {
        if (!this.modeler) {
            console.error('BPMN modeler instance is not initialized.');
            return;
        }

        // Save the BPMN XML
        const xml = await this.modeler.saveXML({ format: true });

        if (!xml || !xml.xml) {
            console.error('Failed to obtain BPMN XML.');
            return;
        }

        // Convert Camunda BPMN XML to Activiti BPMN XML
        const activitiXml = this.convertCamundaToActiviti(xml.xml);

        // Download the Activiti BPMN file
        const blob = new Blob([activitiXml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diagram.bpmn';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Failed to export diagram:', error);
    }
};

  convertCamundaToActiviti = (camundaXml) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(camundaXml, "text/xml");

    const camundaToActivitiMap = {
      //TT les conversions possibles ajouter si existe pas

      // Task elements
      'camunda:task': 'activiti:task',
      'camunda:serviceTask': 'activiti:serviceTask',
      'camunda:userTask': 'activiti:userTask',
      'camunda:sendTask': 'activiti:sendTask',
      'camunda:receiveTask': 'activiti:receiveTask',
      'camunda:scriptTask': 'activiti:scriptTask',
      'camunda:businessRuleTask': 'activiti:businessRuleTask',
      'camunda:manualTask': 'activiti:manualTask',
  
      // Gateway elements
      'camunda:exclusiveGateway': 'activiti:exclusiveGateway',
      'camunda:inclusiveGateway': 'activiti:inclusiveGateway',
      'camunda:parallelGateway': 'activiti:parallelGateway',
      'camunda:eventBasedGateway': 'activiti:eventBasedGateway',
      'camunda:complexGateway': 'activiti:complexGateway',
      'camunda:exclusiveEventBasedGateway': 'activiti:exclusiveEventBasedGateway',
  
      // Start event elements
      'camunda:startEvent': 'activiti:startEvent',
      'camunda:timerEventDefinition': 'activiti:timerEventDefinition',
      'camunda:messageEventDefinition': 'activiti:messageEventDefinition',
      'camunda:signalEventDefinition': 'activiti:signalEventDefinition',
      'camunda:conditionalEventDefinition': 'activiti:conditionalEventDefinition',
      'camunda:errorEventDefinition': 'activiti:errorEventDefinition',
      'camunda:escalationEventDefinition': 'activiti:escalationEventDefinition',
  
      // Intermediate event elements
      'camunda:intermediateCatchEvent': 'activiti:intermediateCatchEvent',
      'camunda:intermediateThrowEvent': 'activiti:intermediateThrowEvent',
      'camunda:signalEventDefinition': 'activiti:signalEventDefinition',
      'camunda:timerEventDefinition': 'activiti:timerEventDefinition',
      'camunda:escalationEventDefinition': 'activiti:escalationEventDefinition',
      'camunda:conditionalEventDefinition': 'activiti:conditionalEventDefinition',
      'camunda:errorEventDefinition': 'activiti:errorEventDefinition',
  
      // End event elements
      'camunda:endEvent': 'activiti:endEvent',
      'camunda:errorEventDefinition': 'activiti:errorEventDefinition',
      'camunda:escalationEventDefinition': 'activiti:escalationEventDefinition',
      'camunda:terminateEventDefinition': 'activiti:terminateEventDefinition',
  
      // Sequence flow
      'camunda:sequenceFlow': 'activiti:sequenceFlow',
  
      // Sub-process elements
      'camunda:subProcess': 'activiti:subProcess',
      'camunda:transaction': 'activiti:transaction',
  
      // Data elements
      'camunda:dataStore': 'activiti:dataStore',
      'camunda:dataObject': 'activiti:dataObject',
      'camunda:dataObjectReference': 'activiti:dataObjectReference',
  
      // Participant elements
      'camunda:participant': 'activiti:participant',
  
      // Lane elements
      'camunda:lane': 'activiti:lane',
  
      // Pool elements
      'camunda:pool': 'activiti:pool',
  
      // Text annotations
      'camunda:textAnnotation': 'activiti:textAnnotation',
  
      // Call activity
      'camunda:callActivity': 'activiti:callActivity',
  
      // Extension elements
      'camunda:extensionElements': 'activiti:extensionElements',
      'camunda:executionListener': 'activiti:executionListener',
      'camunda:inputOutput': 'activiti:inputOutput',
      'camunda:inputParameter': 'activiti:inputParameter',
      'camunda:outputParameter': 'activiti:outputParameter',
      'camunda:script': 'activiti:script',
      'camunda:field': 'activiti:field',
      'camunda:in': 'activiti:in',
      'camunda:out': 'activiti:out',
  
      // Miscellaneous
      'camunda:documentation': 'activiti:documentation',
      

      //Plus complex / BPMN

      // Task elements
      'bpmn:task': 'task',
      'bpmn:serviceTask': 'serviceTask',
      'bpmn:userTask': 'userTask',
      'bpmn:sendTask': 'sendTask',
      'bpmn:receiveTask': 'receiveTask',
      'bpmn:scriptTask': 'scriptTask',
      'bpmn:businessRuleTask': 'businessRuleTask',
      'bpmn:manualTask': 'manualTask',

      // Gateway elements
      'bpmn:exclusiveGateway': 'exclusiveGateway',
      'bpmn:inclusiveGateway': 'inclusiveGateway',
      'bpmn:parallelGateway': 'parallelGateway',
      'bpmn:eventBasedGateway': 'eventBasedGateway',
      'bpmn:complexGateway': 'complexGateway',
      'bpmn:exclusiveEventBasedGateway': 'exclusiveEventBasedGateway',

      // Start event elements
      'bpmn:startEvent': 'startEvent',
      'bpmn:timerEventDefinition': 'timerEventDefinition',
      'bpmn:messageEventDefinition': 'messageEventDefinition',
      'bpmn:signalEventDefinition': 'signalEventDefinition',
      'bpmn:conditionalEventDefinition': 'conditionalEventDefinition',
      'bpmn:errorEventDefinition': 'errorEventDefinition',
      'bpmn:escalationEventDefinition': 'escalationEventDefinition',

      // Intermediate event elements
      'bpmn:intermediateCatchEvent': 'intermediateCatchEvent',
      'bpmn:intermediateThrowEvent': 'intermediateThrowEvent',

      // End event elements
      'bpmn:endEvent': 'endEvent',
      'bpmn:errorEventDefinition': 'errorEventDefinition',
      'bpmn:escalationEventDefinition': 'escalationEventDefinition',
      'bpmn:terminateEventDefinition': 'terminateEventDefinition',

      // Sequence flow
      'bpmn:sequenceFlow': 'sequenceFlow',

      // Sub-process elements
      'bpmn:subProcess': 'subProcess',
      'bpmn:transaction': 'transaction',

      // Data elements
      'bpmn:dataStore': 'dataStore',
      'bpmn:dataObject': 'dataObject',
      'bpmn:dataObjectReference': 'dataObjectReference',

      // Participant elements
      'bpmn:participant': 'participant',

      // Lane elements
      'bpmn:lane': 'lane',

      // Pool elements
      'bpmn:pool': 'pool',

      // Text annotations
      'bpmn:textAnnotation': 'textAnnotation',

      // Call activity
      'bpmn:callActivity': 'callActivity',

      // Extension elements
      'bpmn:extensionElements': 'extensionElements',
      'bpmn:executionListener': 'executionListener',
      'bpmn:inputOutput': 'inputOutput',
      'bpmn:inputParameter': 'inputParameter',
      'bpmn:outputParameter': 'outputParameter',
      'bpmn:script': 'script',
      'bpmn:field': 'field',
      'bpmn:in': 'in',
      'bpmn:out': 'out',

      // Timer event definition
      'bpmn:timerEventDefinition': 'timerEventDefinition',

      // Event subprocess
      'bpmn:subProcess[triggeredByEvent="true"]': 'subProcess',
  };
  

    Object.keys(camundaToActivitiMap).forEach(camundaElement => {
        const activitiElement = camundaToActivitiMap[camundaElement];
        const camundaElements = xmlDoc.getElementsByTagName(camundaElement);

        for (let i = 0; i < camundaElements.length; i++) {
            const camundaElementNode = camundaElements[i];
            const activitiElementNode = xmlDoc.createElement(activitiElement);

            for (let j = 0; j < camundaElementNode.attributes.length; j++) {
                const attribute = camundaElementNode.attributes[j];
                activitiElementNode.setAttribute(attribute.name, attribute.value);
            }

            camundaElementNode.parentNode.replaceChild(activitiElementNode, camundaElementNode);
        }
    });

    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
};


  render = () => {
    return (
      <>
        <EditMenuBar></EditMenuBar>
        <div
          id="TABS-osnld2Uuaf"
          className="ant-tabs ant-tabs-top ant-tabs-editable ant-tabs-card ant-tabs-editable-card css-14r76du"
        >
          <div id="bpmncontainer">
            <div
              id="propview"
              style={{
                width: "25%",
                height: "98vh",
                float: "right",
                maxHeight: "98vh",
                overflowX: "auto",
                backgroundColor: "white"
              }}
            ></div>
            <div
              id="bpmnview"
              style={{ width: "75%", height: "98vh", float: "left" }}
            ></div>
          </div>
        </div>
        <Button
          onClick={this.exportDiagramActivitiBpmn}
          variant="primary"
          type="submit"
          style={{ border: "1px solid #008B8B", marginTop: "10px" }}
        >
          Save!
        </Button>

        <div style={{ marginTop: "40px", paddingTop: "10px" }}></div>
      </>
    );
  };
}

export default BpmnEditor;
