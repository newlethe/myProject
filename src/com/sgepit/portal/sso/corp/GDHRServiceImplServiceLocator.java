/**
 * GDHRServiceImplServiceLocator.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package com.sgepit.portal.sso.corp;

public class GDHRServiceImplServiceLocator extends org.apache.axis.client.Service implements GDHRServiceImplService {

    public GDHRServiceImplServiceLocator() {
    }


    public GDHRServiceImplServiceLocator(org.apache.axis.EngineConfiguration config) {
        super(config);
    }

    public GDHRServiceImplServiceLocator(java.lang.String wsdlLoc, javax.xml.namespace.QName sName) throws javax.xml.rpc.ServiceException {
        super(wsdlLoc, sName);
    }

    // Use to get a proxy class for GDHRServiceImpl
    private java.lang.String GDHRServiceImpl_address = "http://localhost:8080/gdhrwebservice/services/GDHRServiceImpl";

    public java.lang.String getGDHRServiceImplAddress() {
        return GDHRServiceImpl_address;
    }

    // The WSDD service name defaults to the port name.
    private java.lang.String GDHRServiceImplWSDDServiceName = "GDHRServiceImpl";

    public java.lang.String getGDHRServiceImplWSDDServiceName() {
        return GDHRServiceImplWSDDServiceName;
    }

    public void setGDHRServiceImplWSDDServiceName(java.lang.String name) {
        GDHRServiceImplWSDDServiceName = name;
    }

    public GDHRServiceImpl getGDHRServiceImpl() throws javax.xml.rpc.ServiceException {
       java.net.URL endpoint;
        try {
            endpoint = new java.net.URL(GDHRServiceImpl_address);
        }
        catch (java.net.MalformedURLException e) {
            throw new javax.xml.rpc.ServiceException(e);
        }
        return getGDHRServiceImpl(endpoint);
    }

    public GDHRServiceImpl getGDHRServiceImpl(java.net.URL portAddress) throws javax.xml.rpc.ServiceException {
        try {
            GDHRServiceImplSoapBindingStub _stub = new GDHRServiceImplSoapBindingStub(portAddress, this);
            _stub.setPortName(getGDHRServiceImplWSDDServiceName());
            return _stub;
        }
        catch (org.apache.axis.AxisFault e) {
            return null;
        }
    }

    public void setGDHRServiceImplEndpointAddress(java.lang.String address) {
        GDHRServiceImpl_address = address;
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        try {
            if (GDHRServiceImpl.class.isAssignableFrom(serviceEndpointInterface)) {
                GDHRServiceImplSoapBindingStub _stub = new GDHRServiceImplSoapBindingStub(new java.net.URL(GDHRServiceImpl_address), this);
                _stub.setPortName(getGDHRServiceImplWSDDServiceName());
                return _stub;
            }
        }
        catch (java.lang.Throwable t) {
            throw new javax.xml.rpc.ServiceException(t);
        }
        throw new javax.xml.rpc.ServiceException("There is no stub implementation for the interface:  " + (serviceEndpointInterface == null ? "null" : serviceEndpointInterface.getName()));
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(javax.xml.namespace.QName portName, Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        if (portName == null) {
            return getPort(serviceEndpointInterface);
        }
        java.lang.String inputPortName = portName.getLocalPart();
        if ("GDHRServiceImpl".equals(inputPortName)) {
            return getGDHRServiceImpl();
        }
        else  {
            java.rmi.Remote _stub = getPort(serviceEndpointInterface);
            ((org.apache.axis.client.Stub) _stub).setPortName(portName);
            return _stub;
        }
    }

    public javax.xml.namespace.QName getServiceName() {
        return new javax.xml.namespace.QName("http://pub.gdhrservice.itf.nc", "GDHRServiceImplService");
    }

    private java.util.HashSet ports = null;

    public java.util.Iterator getPorts() {
        if (ports == null) {
            ports = new java.util.HashSet();
            ports.add(new javax.xml.namespace.QName("http://pub.gdhrservice.itf.nc", "GDHRServiceImpl"));
        }
        return ports.iterator();
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(java.lang.String portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        
if ("GDHRServiceImpl".equals(portName)) {
            setGDHRServiceImplEndpointAddress(address);
        }
        else 
{ // Unknown Port Name
            throw new javax.xml.rpc.ServiceException(" Cannot set Endpoint Address for Unknown Port" + portName);
        }
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(javax.xml.namespace.QName portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        setEndpointAddress(portName.getLocalPart(), address);
    }

}
