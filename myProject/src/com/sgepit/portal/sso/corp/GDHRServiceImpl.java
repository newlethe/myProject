/**
 * GDHRServiceImpl.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package com.sgepit.portal.sso.corp;

public interface GDHRServiceImpl extends java.rmi.Remote {
    public java.lang.String getDeptById(java.lang.String departid) throws java.rmi.RemoteException;
    public java.lang.String getDeptsByAll() throws java.rmi.RemoteException;
    public java.lang.String getNewDepts(java.lang.String time) throws java.rmi.RemoteException;
    public java.lang.String getNewPeoples(java.lang.String time) throws java.rmi.RemoteException;
    public java.lang.String getPeopleById(java.lang.String personid) throws java.rmi.RemoteException;
    public java.lang.String getPeoplesCount() throws java.rmi.RemoteException;
    public java.lang.String getPeoplesByAll(int start, int max) throws java.rmi.RemoteException;
    public java.lang.String getNewUnits(java.lang.String time) throws java.rmi.RemoteException;
    public java.lang.String getUnitsByAll() throws java.rmi.RemoteException;
    public java.lang.String getUnitsById(java.lang.String unitid) throws java.rmi.RemoteException;
}
