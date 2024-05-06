export const emptyBpmn = `<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:modeler="http://camunda.org/schema/modeler/1.0" id="Definitions_0775b52" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.11.1" modeler:executionPlatform="Camunda Platform" modeler:executionPlatformVersion="7.15.0">
  <bpmn:process id="NetworkEventNotif_V13" name="NetworkEventNotif_V13" isExecutable="true">
    <bpmn:extensionElements>
      <camunda:properties>
        <camunda:property name="CompressedCanonical" value="true"/>
      </camunda:properties>
    </bpmn:extensionElements>
    <bpmn:startEvent id="StartNetworkEventProcess" camunda:asyncBefore="true" camunda:exclusive="false">
      <bpmn:extensionElements>
        <activiti:executionListener event="start"/>
      </bpmn:extensionElements>
      <bpmn:outgoing>Flow_1lbbjg2</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:subProcess id="AEM_SubProcess">
      <bpmn:incoming>Flow_NetworkEvent</bpmn:incoming>
      <bpmn:outgoing>Flow_0ox00yw</bpmn:outgoing>
      <bpmn:startEvent id="Event_Start_AEM">
        <bpmn:outgoing>Flow_000fd29</bpmn:outgoing>
      </bpmn:startEvent>
      <bpmn:sequenceFlow id="Flow_000fd29" sourceRef="Event_Start_AEM" targetRef="Gateway_Before_AEM"/>
      <bpmn:sequenceFlow id="Flow_Before_Aem" sourceRef="Gateway_Before_AEM" targetRef="Activity_AemFicheLigne"/>
      <bpmn:exclusiveGateway id="Gateway_After_AEM" default="Flow_Aem_OK">
        <bpmn:incoming>Flow_After_Aem</bpmn:incoming>
        <bpmn:outgoing>Flow_Aem_OK</bpmn:outgoing>
        <bpmn:outgoing>Flow_Aem_KO</bpmn:outgoing>
      </bpmn:exclusiveGateway>
      <bpmn:sequenceFlow id="Flow_After_Aem" sourceRef="Activity_AemFicheLigne" targetRef="Gateway_After_AEM"/>
      <bpmn:endEvent id="Event_End_AEM">
        <bpmn:incoming>Flow_Aem_OK</bpmn:incoming>
      </bpmn:endEvent>
      <bpmn:sequenceFlow id="Flow_Aem_OK" sourceRef="Gateway_After_AEM" targetRef="Event_End_AEM"/>
      <bpmn:intermediateCatchEvent id="Aem_WaitStep" name="Aem_WaitStep">
        <bpmn:extensionElements>
          <camunda:executionListener event="end">
            <camunda:script scriptFormat="javascript" resource="classpath://javascript/setDataSlotsWhenWaitStepCompleted.js"/>
          </camunda:executionListener>
        </bpmn:extensionElements>
        <bpmn:incoming>Flow_Aem_KO</bpmn:incoming>
        <bpmn:outgoing>Flow_Retry_Aem</bpmn:outgoing>
        <bpmn:conditionalEventDefinition id="ConditionalEventDefinition_0uck62g">
          <bpmn:condition xsi:type="bpmn:tFormalExpression">{ControlAction.toLowerCase() == "retrym"}</bpmn:condition>
        </bpmn:conditionalEventDefinition>
      </bpmn:intermediateCatchEvent>
      <bpmn:sequenceFlow id="Flow_Aem_KO" name="ErrorStatus !=0&#10;" sourceRef="Gateway_After_AEM" targetRef="Aem_WaitStep">
        <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">{ErrorStatus != 0}</bpmn:conditionExpression>
      </bpmn:sequenceFlow>
      <bpmn:sequenceFlow id="Flow_Retry_Aem" sourceRef="Aem_WaitStep" targetRef="Gateway_Before_AEM"/>
      <bpmn:exclusiveGateway id="Gateway_Before_AEM">
        <bpmn:incoming>Flow_000fd29</bpmn:incoming>
        <bpmn:incoming>Flow_Retry_Aem</bpmn:incoming>
        <bpmn:outgoing>Flow_Before_Aem</bpmn:outgoing>
      </bpmn:exclusiveGateway>
      <bpmn:serviceTask id="Activity_AemFicheLigne" name="AemFicheLigneJmsAdaptor" camunda:asyncBefore="true" camunda:class="com.sfr.adapa.adapaCamunda.delegate.AsynchronousSonicJmsTask">
        <bpmn:extensionElements>
          <activiti:executionListener event="end"/>
          <camunda:executionListener event="start">
            <camunda:script scriptFormat="javascript">execution.setVariable('ControlAction','active');
</camunda:script>
          </camunda:executionListener>
          <camunda:inputOutput>
            <camunda:inputParameter name="MctuMappingStep">AEMficheLigne</camunda:inputParameter>
          </camunda:inputOutput>
          <camunda:failedJobRetryTimeCycle>R3/PT2M</camunda:failedJobRetryTimeCycle>
        </bpmn:extensionElements>
        <bpmn:incoming>Flow_Before_Aem</bpmn:incoming>
        <bpmn:outgoing>Flow_After_Aem</bpmn:outgoing>
      </bpmn:serviceTask>
    </bpmn:subProcess>
    <bpmn:exclusiveGateway id="Gateway_Which_SCS" name="ScsMvno ?&#10;&#10;&#10;" default="Flow_Not_MVNO">
      <bpmn:incoming>Flow_0ox00yw</bpmn:incoming>
      <bpmn:outgoing>Flow_Not_MVNO</bpmn:outgoing>
      <bpmn:outgoing>Flow_Scs_Mvno</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="Flow_0ox00yw" sourceRef="AEM_SubProcess" targetRef="Gateway_Which_SCS"/>
    <bpmn:subProcess id="FMS_SubProcess" name="FMS_SubProcess">
      <bpmn:incoming>Flow_Not_MVNO</bpmn:incoming>
      <bpmn:outgoing>Flow_0au3djw</bpmn:outgoing>
      <bpmn:startEvent id="Event_Start_FMS">
        <bpmn:outgoing>Flow_1pofxhw</bpmn:outgoing>
      </bpmn:startEvent>
      <bpmn:exclusiveGateway id="Gateway_After_FMS" default="Flow_0jh7g1r">
        <bpmn:incoming>Flow_10p9dt4</bpmn:incoming>
        <bpmn:outgoing>Flow_1oc8811</bpmn:outgoing>
        <bpmn:outgoing>Flow_0jh7g1r</bpmn:outgoing>
      </bpmn:exclusiveGateway>
      <bpmn:intermediateCatchEvent id="FMS_WaitStep" name="FMS_WaitStep">
        <bpmn:extensionElements>
          <activiti:executionListener event="end"/>
        </bpmn:extensionElements>
        <bpmn:incoming>Flow_1oc8811</bpmn:incoming>
        <bpmn:outgoing>Flow_0owvkws</bpmn:outgoing>
        <bpmn:conditionalEventDefinition id="ConditionalEventDefinition_0kaf445">
          <bpmn:condition xsi:type="bpmn:tFormalExpression">{ControlAction.toLowerCase() == "retrym"}</bpmn:condition>
        </bpmn:conditionalEventDefinition>
      </bpmn:intermediateCatchEvent>
      <bpmn:exclusiveGateway id="Gateway_Before_FMS">
        <bpmn:incoming>Flow_0owvkws</bpmn:incoming>
        <bpmn:incoming>Flow_1pofxhw</bpmn:incoming>
        <bpmn:outgoing>Flow_055skuv</bpmn:outgoing>
      </bpmn:exclusiveGateway>
      <bpmn:sequenceFlow id="Flow_0owvkws" sourceRef="FMS_WaitStep" targetRef="Gateway_Before_FMS"/>
      <bpmn:sequenceFlow id="Flow_1oc8811" name="ErrorStatus !=0&#10;" sourceRef="Gateway_After_FMS" targetRef="FMS_WaitStep">
        <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">{ErrorStatus != 0}</bpmn:conditionExpression>
      </bpmn:sequenceFlow>
      <bpmn:sequenceFlow id="Flow_10p9dt4" sourceRef="CreateFM_JmsAdaptor" targetRef="Gateway_After_FMS"/>
      <bpmn:sequenceFlow id="Flow_055skuv" sourceRef="Gateway_Before_FMS" targetRef="CreateFM_JmsAdaptor"/>
      <bpmn:sequenceFlow id="Flow_1pofxhw" sourceRef="Event_Start_FMS" targetRef="Gateway_Before_FMS"/>
      <bpmn:endEvent id="Event_060yyl1">
        <bpmn:incoming>Flow_0etlg91</bpmn:incoming>
      </bpmn:endEvent>
      <bpmn:sequenceFlow id="Flow_0jh7g1r" sourceRef="Gateway_After_FMS" targetRef="Event_ResponseFmsNotification"/>
      <bpmn:sequenceFlow id="Flow_0etlg91" sourceRef="Event_ResponseFmsNotification" targetRef="Event_060yyl1"/>
      <bpmn:intermediateCatchEvent id="Event_ResponseFmsNotification" name="Event_ResponseFmsNotification_MN">
        <bpmn:extensionElements>
          <camunda:executionListener event="start">
            <camunda:script scriptFormat="javascript">execution.setVariable('ControlAction','active');</camunda:script>
          </camunda:executionListener>
          <activiti:executionListener event="end"/>
          <camunda:inputOutput>
            <camunda:outputParameter name="ControlAction">{(ErrorStatus==0)?'Active':'Achevée'}</camunda:outputParameter>
            <camunda:outputParameter name="WorkStepInError">{(ErrorStatus==0)?'':'FMSResponseNotification'}</camunda:outputParameter>
          </camunda:inputOutput>
        </bpmn:extensionElements>
        <bpmn:incoming>Flow_0jh7g1r</bpmn:incoming>
        <bpmn:outgoing>Flow_0etlg91</bpmn:outgoing>
        <bpmn:messageEventDefinition id="MessageEventDefinition_08uhwxj" messageRef="Message_1kcqwsk"/>
      </bpmn:intermediateCatchEvent>
      <bpmn:serviceTask id="CreateFM_JmsAdaptor" name="CreateFMS_JmsAdaptor" camunda:asyncBefore="true" camunda:class="com.sfr.adapa.adapaCamunda.delegate.AsynchronousSonicJmsTask">
        <bpmn:extensionElements>
          <camunda:executionListener event="end">
            <camunda:script scriptFormat="javascript" resource="classpath://javascript/evaluateDataslotsWhenConnectorEnd.js"/>
          </camunda:executionListener>
          <activiti:executionListener event="start"/>
          <camunda:inputOutput>
            <camunda:inputParameter name="MctuMappingStep">FMSNotificationService</camunda:inputParameter>
          </camunda:inputOutput>
        </bpmn:extensionElements>
        <bpmn:incoming>Flow_055skuv</bpmn:incoming>
        <bpmn:outgoing>Flow_10p9dt4</bpmn:outgoing>
      </bpmn:serviceTask>
    </bpmn:subProcess>
    <bpmn:sequenceFlow id="Flow_Not_MVNO" name="Not Mvno Scs" sourceRef="Gateway_Which_SCS" targetRef="FMS_SubProcess"/>
    <bpmn:subProcess id="MVNO_SubProcess" name="MVNO_SubProcess">
      <bpmn:incoming>Flow_Scs_Mvno</bpmn:incoming>
      <bpmn:outgoing>Flow_09sia49</bpmn:outgoing>
      <bpmn:startEvent id="Event_Start_MVNO">
        <bpmn:outgoing>Flow_1klqihj</bpmn:outgoing>
      </bpmn:startEvent>
      <bpmn:exclusiveGateway id="Gateway_After_MVNO" default="Flow_06odcqy">
        <bpmn:incoming>Flow_1icxry8</bpmn:incoming>
        <bpmn:outgoing>Flow_0rigrl3</bpmn:outgoing>
        <bpmn:outgoing>Flow_06odcqy</bpmn:outgoing>
      </bpmn:exclusiveGateway>
      <bpmn:endEvent id="Event_End_MVNO">
        <bpmn:incoming>Flow_06odcqy</bpmn:incoming>
      </bpmn:endEvent>
      <bpmn:intermediateCatchEvent id="MVNO_WaitStep" name="MVNO_WaitStep">
        <bpmn:extensionElements>
          <camunda:executionListener event="end">
            <camunda:script scriptFormat="javascript" resource="classpath://javascript/setDataSlotsWhenWaitStepCompleted.js"/>
          </camunda:executionListener>
        </bpmn:extensionElements>
        <bpmn:incoming>Flow_0rigrl3</bpmn:incoming>
        <bpmn:outgoing>Flow_1hsw2wd</bpmn:outgoing>
        <bpmn:conditionalEventDefinition id="ConditionalEventDefinition_14yolfi">
          <bpmn:condition xsi:type="bpmn:tFormalExpression">{ControlAction.toLowerCase() == "retrym"}</bpmn:condition>
        </bpmn:conditionalEventDefinition>
      </bpmn:intermediateCatchEvent>
      <bpmn:exclusiveGateway id="Gateway_Before_MVNO">
        <bpmn:incoming>Flow_1hsw2wd</bpmn:incoming>
        <bpmn:incoming>Flow_1klqihj</bpmn:incoming>
        <bpmn:outgoing>Flow_0dc052g</bpmn:outgoing>
      </bpmn:exclusiveGateway>
      <bpmn:serviceTask id="Mvno_JmsAdaptor" name="Mvno_JmsAdaptor" camunda:asyncBefore="true" camunda:class="com.sfr.adapa.adapaCamunda.delegate.AsynchronousSonicJmsTask">
        <bpmn:extensionElements>
          <activiti:executionListener event="end"/>
          <camunda:executionListener event="start">
            <camunda:script scriptFormat="javascript">execution.setVariable('ControlAction','active');
</camunda:script>
          </camunda:executionListener>
          <camunda:inputOutput>
            <camunda:inputParameter name="MctuMappingStep">EventNotification</camunda:inputParameter>
          </camunda:inputOutput>
        </bpmn:extensionElements>
        <bpmn:incoming>Flow_0dc052g</bpmn:incoming>
        <bpmn:outgoing>Flow_1icxry8</bpmn:outgoing>
      </bpmn:serviceTask>
      <bpmn:sequenceFlow id="Flow_1hsw2wd" sourceRef="MVNO_WaitStep" targetRef="Gateway_Before_MVNO"/>
      <bpmn:sequenceFlow id="Flow_0rigrl3" name="ErrorStatus !=0&#10;" sourceRef="Gateway_After_MVNO" targetRef="MVNO_WaitStep">
        <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">{ErrorStatus != 0}</bpmn:conditionExpression>
      </bpmn:sequenceFlow>
      <bpmn:sequenceFlow id="Flow_06odcqy" sourceRef="Gateway_After_MVNO" targetRef="Event_End_MVNO"/>
      <bpmn:sequenceFlow id="Flow_1icxry8" sourceRef="Mvno_JmsAdaptor" targetRef="Gateway_After_MVNO"/>
      <bpmn:sequenceFlow id="Flow_0dc052g" sourceRef="Gateway_Before_MVNO" targetRef="Mvno_JmsAdaptor"/>
      <bpmn:sequenceFlow id="Flow_1klqihj" sourceRef="Event_Start_MVNO" targetRef="Gateway_Before_MVNO"/>
    </bpmn:subProcess>
    <bpmn:sequenceFlow id="Flow_Scs_Mvno" name="Mvno Scs&#10;&#10;" sourceRef="Gateway_Which_SCS" targetRef="MVNO_SubProcess">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression" language="javascript">ListeCodeScsMvno.indexOf(CodeSCS)&gt;=0;</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:exclusiveGateway id="Gateway_1p55hzn">
      <bpmn:incoming>Flow_0au3djw</bpmn:incoming>
      <bpmn:incoming>Flow_09sia49</bpmn:incoming>
      <bpmn:incoming>Flow_0va5z9t</bpmn:incoming>
      <bpmn:outgoing>Flow_1cbac3q</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="Flow_0au3djw" sourceRef="FMS_SubProcess" targetRef="Gateway_1p55hzn"/>
    <bpmn:sequenceFlow id="Flow_09sia49" sourceRef="MVNO_SubProcess" targetRef="Gateway_1p55hzn"/>
    <bpmn:endEvent id="Event_0r2xqdv">
      <bpmn:incoming>Flow_1cbac3q</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1cbac3q" sourceRef="Gateway_1p55hzn" targetRef="Event_0r2xqdv"/>
    <bpmn:exclusiveGateway id="Gateway_1rceui9" default="Flow_NetworkEvent">
      <bpmn:incoming>Flow_1lbbjg2</bpmn:incoming>
      <bpmn:outgoing>Flow_NetworkEvent</bpmn:outgoing>
      <bpmn:outgoing>Flow_PayerLaCarte</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="Flow_1lbbjg2" sourceRef="StartNetworkEventProcess" targetRef="Gateway_1rceui9"/>
    <bpmn:sequenceFlow id="Flow_NetworkEvent" sourceRef="Gateway_1rceui9" targetRef="AEM_SubProcess"/>
    <bpmn:subProcess id="ActivationPar_SubProcess">
      <bpmn:incoming>Flow_PayerLaCarte</bpmn:incoming>
      <bpmn:outgoing>Flow_0va5z9t</bpmn:outgoing>
      <bpmn:startEvent id="Event_start_ActivationPar">
        <bpmn:outgoing>Flow_04roucq</bpmn:outgoing>
      </bpmn:startEvent>
      <bpmn:exclusiveGateway id="Gateway_After_Activation" default="Flow_160vlu8">
        <bpmn:incoming>Flow_0rkxyj8</bpmn:incoming>
        <bpmn:outgoing>Flow_BIOS_KO</bpmn:outgoing>
        <bpmn:outgoing>Flow_160vlu8</bpmn:outgoing>
      </bpmn:exclusiveGateway>
      <bpmn:endEvent id="Event_End_ActivationPar">
        <bpmn:incoming>Flow_160vlu8</bpmn:incoming>
      </bpmn:endEvent>
      <bpmn:exclusiveGateway id="Gateway_Before_Activation">
        <bpmn:incoming>Flow_07v99zu</bpmn:incoming>
        <bpmn:incoming>Flow_04roucq</bpmn:incoming>
        <bpmn:outgoing>Flow_0c70s8d</bpmn:outgoing>
      </bpmn:exclusiveGateway>
      <bpmn:sequenceFlow id="Flow_07v99zu" sourceRef="ActivationPar_WaitStep" targetRef="Gateway_Before_Activation"/>
      <bpmn:sequenceFlow id="Flow_BIOS_KO" name="Retry Technical Error" sourceRef="Gateway_After_Activation" targetRef="ActivationPar_WaitStep">
        <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">{ErrorStatus==1 &amp;&amp; ActivationLCARetryCounter&lt;3}</bpmn:conditionExpression>
      </bpmn:sequenceFlow>
      <bpmn:sequenceFlow id="Flow_160vlu8" sourceRef="Gateway_After_Activation" targetRef="Event_End_ActivationPar"/>
      <bpmn:sequenceFlow id="Flow_0rkxyj8" sourceRef="ActivationPar_JmsAdaptor" targetRef="Gateway_After_Activation"/>
      <bpmn:sequenceFlow id="Flow_0c70s8d" sourceRef="Gateway_Before_Activation" targetRef="ActivationPar_JmsAdaptor"/>
      <bpmn:sequenceFlow id="Flow_04roucq" sourceRef="Event_start_ActivationPar" targetRef="Gateway_Before_Activation"/>
      <bpmn:serviceTask id="ActivationPar_JmsAdaptor" name="ActivationPar_JmsAdaptor" camunda:asyncBefore="true" camunda:class="com.sfr.adapa.adapaCamunda.delegate.AsynchronousSonicJmsTask">
        <bpmn:extensionElements>
          <activiti:executionListener event="end"/>
          <camunda:executionListener event="start">
            <camunda:script scriptFormat="javascript">execution.setVariable('ControlAction','active');
</camunda:script>
          </camunda:executionListener>
          <camunda:inputOutput>
            <camunda:inputParameter name="MctuMappingStep">ActivationPAR</camunda:inputParameter>
          </camunda:inputOutput>
        </bpmn:extensionElements>
        <bpmn:incoming>Flow_0c70s8d</bpmn:incoming>
        <bpmn:outgoing>Flow_0rkxyj8</bpmn:outgoing>
      </bpmn:serviceTask>
      <bpmn:intermediateCatchEvent id="ActivationPar_WaitStep" name="ActivationPar_WaitStep">
        <bpmn:extensionElements>
          <activiti:executionListener event="end"/>
          <camunda:executionListener event="start">
            <camunda:script scriptFormat="javascript">execution.setVariable('ActivationLCARetryCounter',ActivationLCARetryCounter++);</camunda:script>
          </camunda:executionListener>
        </bpmn:extensionElements>
        <bpmn:incoming>Flow_BIOS_KO</bpmn:incoming>
        <bpmn:outgoing>Flow_07v99zu</bpmn:outgoing>
        <bpmn:timerEventDefinition id="TimerEventDefinition_1h565gi">
          <bpmn:timeDuration xsi:type="bpmn:tFormalExpression">PT60S</bpmn:timeDuration>
        </bpmn:timerEventDefinition>
      </bpmn:intermediateCatchEvent>
    </bpmn:subProcess>
    <bpmn:sequenceFlow id="Flow_PayerLaCarte" sourceRef="Gateway_1rceui9" targetRef="ActivationPar_SubProcess">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">{EventID.startsWith('PA')}</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="Flow_0va5z9t" sourceRef="ActivationPar_SubProcess" targetRef="Gateway_1p55hzn"/>
  </bpmn:process>
  <bpmn:message id="Message_1kcqwsk" name="FMSResponseNotification_MN"/>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="NetworkEventNotif_V13">
      <bpmndi:BPMNEdge id="Flow_0va5z9t_di" bpmnElement="Flow_0va5z9t">
        <di:waypoint x="1105" y="705"/>
        <di:waypoint x="1590" y="705"/>
        <di:waypoint x="1590" y="470"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_05cr89n_di" bpmnElement="Flow_PayerLaCarte">
        <di:waypoint x="280" y="340"/>
        <di:waypoint x="280" y="705"/>
        <di:waypoint x="675" y="705"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0n3nksj_di" bpmnElement="Flow_NetworkEvent">
        <di:waypoint x="305" y="315"/>
        <di:waypoint x="380" y="315"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1lbbjg2_di" bpmnElement="Flow_1lbbjg2">
        <di:waypoint x="188" y="315"/>
        <di:waypoint x="255" y="315"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1cbac3q_di" bpmnElement="Flow_1cbac3q">
        <di:waypoint x="1615" y="445"/>
        <di:waypoint x="1892" y="445"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_09sia49_di" bpmnElement="Flow_09sia49">
        <di:waypoint x="1480" y="445"/>
        <di:waypoint x="1565" y="445"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0au3djw_di" bpmnElement="Flow_0au3djw">
        <di:waypoint x="1495" y="167"/>
        <di:waypoint x="1590" y="167"/>
        <di:waypoint x="1590" y="420"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0sau2xj_di" bpmnElement="Flow_Scs_Mvno">
        <di:waypoint x="890" y="340"/>
        <di:waypoint x="890" y="455"/>
        <di:waypoint x="975" y="455"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="905" y="435" width="49" height="40"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0lc64zf_di" bpmnElement="Flow_Not_MVNO">
        <di:waypoint x="890" y="290"/>
        <di:waypoint x="890" y="167"/>
        <di:waypoint x="975" y="167"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="895" y="183" width="69" height="14"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0ox00yw_di" bpmnElement="Flow_0ox00yw">
        <di:waypoint x="810" y="315"/>
        <di:waypoint x="865" y="315"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Event_0rbokq7_di" bpmnElement="StartNetworkEventProcess">
        <dc:Bounds x="152" y="297" width="36" height="36"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="129" y="142" width="83" height="27"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_03oyv5a_di" bpmnElement="AEM_SubProcess" isExpanded="true">
        <dc:Bounds x="380" y="230" width="430" height="170"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_06kh6tt_di" bpmnElement="Flow_Retry_Aem">
        <di:waypoint x="572" y="268"/>
        <di:waypoint x="500" y="268"/>
        <di:waypoint x="500" y="313"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1xq55fi_di" bpmnElement="Flow_Aem_KO">
        <di:waypoint x="700" y="313"/>
        <di:waypoint x="700" y="268"/>
        <di:waypoint x="608" y="268"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="631" y="255" width="75" height="27"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_09ogvo7_di" bpmnElement="Flow_Aem_OK">
        <di:waypoint x="725" y="338"/>
        <di:waypoint x="752" y="338"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0ydxr4e_di" bpmnElement="Flow_After_Aem">
        <di:waypoint x="650" y="338"/>
        <di:waypoint x="675" y="338"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1613al4_di" bpmnElement="Flow_Before_Aem">
        <di:waypoint x="525" y="338"/>
        <di:waypoint x="550" y="338"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_000fd29_di" bpmnElement="Flow_000fd29">
        <di:waypoint x="436" y="338"/>
        <di:waypoint x="475" y="338"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Event_0g4589v_di" bpmnElement="Event_Start_AEM">
        <dc:Bounds x="400" y="320" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_04bqpe2_di" bpmnElement="Gateway_After_AEM" isMarkerVisible="true">
        <dc:Bounds x="675" y="313" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_013m8la_di" bpmnElement="Event_End_AEM">
        <dc:Bounds x="752" y="320" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1izciyw_di" bpmnElement="Aem_WaitStep">
        <dc:Bounds x="572" y="250" width="36" height="36"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="553" y="233" width="73" height="14"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0d726n9_di" bpmnElement="Gateway_Before_AEM" isMarkerVisible="true">
        <dc:Bounds x="475" y="313" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0r1dtdf_di" bpmnElement="Activity_AemFicheLigne">
        <dc:Bounds x="550" y="298" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_05aqglf_di" bpmnElement="Gateway_Which_SCS" isMarkerVisible="true">
        <dc:Bounds x="865" y="290" width="50" height="50"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="893" y="280" width="55" height="53"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0s61otn_di" bpmnElement="FMS_SubProcess" isExpanded="true">
        <dc:Bounds x="975" y="60" width="520" height="192"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_0etlg91_di" bpmnElement="Flow_0etlg91">
        <di:waypoint x="1388" y="190"/>
        <di:waypoint x="1422" y="190"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0jh7g1r_di" bpmnElement="Flow_0jh7g1r">
        <di:waypoint x="1320" y="190"/>
        <di:waypoint x="1352" y="190"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1pofxhw_di" bpmnElement="Flow_1pofxhw">
        <di:waypoint x="1031" y="190"/>
        <di:waypoint x="1070" y="190"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_055skuv_di" bpmnElement="Flow_055skuv">
        <di:waypoint x="1120" y="190"/>
        <di:waypoint x="1145" y="190"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_10p9dt4_di" bpmnElement="Flow_10p9dt4">
        <di:waypoint x="1245" y="190"/>
        <di:waypoint x="1270" y="190"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1oc8811_di" bpmnElement="Flow_1oc8811">
        <di:waypoint x="1295" y="165"/>
        <di:waypoint x="1295" y="120"/>
        <di:waypoint x="1203" y="120"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1226" y="107" width="75" height="27"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0owvkws_di" bpmnElement="Flow_0owvkws">
        <di:waypoint x="1167" y="120"/>
        <di:waypoint x="1095" y="120"/>
        <di:waypoint x="1095" y="165"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Event_1093cfs_di" bpmnElement="Event_Start_FMS">
        <dc:Bounds x="995" y="172" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0yuqsc2_di" bpmnElement="Gateway_After_FMS" isMarkerVisible="true">
        <dc:Bounds x="1270" y="165" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1g8st81_di" bpmnElement="FMS_WaitStep">
        <dc:Bounds x="1167" y="102" width="36" height="36"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1148" y="85" width="75" height="14"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1vwi1kn_di" bpmnElement="Gateway_Before_FMS" isMarkerVisible="true">
        <dc:Bounds x="1070" y="165" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_060yyl1_di" bpmnElement="Event_060yyl1">
        <dc:Bounds x="1422" y="172" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0i4ay2m_di" bpmnElement="Event_ResponseFmsNotification">
        <dc:Bounds x="1352" y="172" width="36" height="36"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1328" y="215" width="84" height="40"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0km53bl_di" bpmnElement="CreateFM_JmsAdaptor">
        <dc:Bounds x="1145" y="150" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_03ypu5l_di" bpmnElement="MVNO_SubProcess" isExpanded="true">
        <dc:Bounds x="975" y="350" width="505" height="190"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1klqihj_di" bpmnElement="Flow_1klqihj">
        <di:waypoint x="1031" y="478"/>
        <di:waypoint x="1070" y="478"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0dc052g_di" bpmnElement="Flow_0dc052g">
        <di:waypoint x="1120" y="478"/>
        <di:waypoint x="1145" y="478"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1icxry8_di" bpmnElement="Flow_1icxry8">
        <di:waypoint x="1245" y="478"/>
        <di:waypoint x="1270" y="478"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_06odcqy_di" bpmnElement="Flow_06odcqy">
        <di:waypoint x="1320" y="478"/>
        <di:waypoint x="1347" y="478"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0rigrl3_di" bpmnElement="Flow_0rigrl3">
        <di:waypoint x="1295" y="453"/>
        <di:waypoint x="1295" y="408"/>
        <di:waypoint x="1203" y="408"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1226" y="395" width="75" height="27"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1hsw2wd_di" bpmnElement="Flow_1hsw2wd">
        <di:waypoint x="1167" y="408"/>
        <di:waypoint x="1095" y="408"/>
        <di:waypoint x="1095" y="453"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Event_195i4sw_di" bpmnElement="Event_Start_MVNO">
        <dc:Bounds x="995" y="460" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0rqi090_di" bpmnElement="Gateway_After_MVNO" isMarkerVisible="true">
        <dc:Bounds x="1270" y="453" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_170vlvq_di" bpmnElement="Event_End_MVNO">
        <dc:Bounds x="1347" y="460" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0aykry8_di" bpmnElement="MVNO_WaitStep">
        <dc:Bounds x="1167" y="390" width="36" height="36"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1148" y="373" width="85" height="14"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1qoimhs_di" bpmnElement="Gateway_Before_MVNO" isMarkerVisible="true">
        <dc:Bounds x="1070" y="453" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0el6e11_di" bpmnElement="Mvno_JmsAdaptor">
        <dc:Bounds x="1145" y="438" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1p55hzn_di" bpmnElement="Gateway_1p55hzn" isMarkerVisible="true">
        <dc:Bounds x="1565" y="420" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0r2xqdv_di" bpmnElement="Event_0r2xqdv">
        <dc:Bounds x="1892" y="427" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1rceui9_di" bpmnElement="Gateway_1rceui9" isMarkerVisible="true">
        <dc:Bounds x="255" y="290" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1l60dq1_di" bpmnElement="ActivationPar_SubProcess" isExpanded="true">
        <dc:Bounds x="675" y="620" width="430" height="170"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_04roucq_di" bpmnElement="Flow_04roucq">
        <di:waypoint x="731" y="728"/>
        <di:waypoint x="770" y="728"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0c70s8d_di" bpmnElement="Flow_0c70s8d">
        <di:waypoint x="820" y="728"/>
        <di:waypoint x="845" y="728"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0rkxyj8_di" bpmnElement="Flow_0rkxyj8">
        <di:waypoint x="945" y="728"/>
        <di:waypoint x="970" y="728"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_160vlu8_di" bpmnElement="Flow_160vlu8">
        <di:waypoint x="1020" y="728"/>
        <di:waypoint x="1047" y="728"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1kf4nzg_di" bpmnElement="Flow_BIOS_KO">
        <di:waypoint x="995" y="703"/>
        <di:waypoint x="995" y="658"/>
        <di:waypoint x="903" y="658"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="976" y="678" width="76" height="27"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_07v99zu_di" bpmnElement="Flow_07v99zu">
        <di:waypoint x="867" y="658"/>
        <di:waypoint x="795" y="658"/>
        <di:waypoint x="795" y="703"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Event_1vg1b76_di" bpmnElement="Event_start_ActivationPar">
        <dc:Bounds x="695" y="710" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1xwwz3a_di" bpmnElement="Gateway_After_Activation" isMarkerVisible="true">
        <dc:Bounds x="970" y="703" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1qm5qb8_di" bpmnElement="Event_End_ActivationPar">
        <dc:Bounds x="1047" y="710" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1cr7xb4_di" bpmnElement="Gateway_Before_Activation" isMarkerVisible="true">
        <dc:Bounds x="770" y="703" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1hur6bb_di" bpmnElement="ActivationPar_JmsAdaptor">
        <dc:Bounds x="845" y="688" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_036mr55_di" bpmnElement="ActivationPar_WaitStep">
        <dc:Bounds x="867" y="640" width="36" height="36"/>
        <bpmndi:BPMNLabel>
          <dc:Bounds x="842" y="623" width="87" height="27"/>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;
