package com.sgepit.pmis.vehicle.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

public class VehicleDAO extends BaseDAO {

	private static final Log log = LogFactory.getLog(VehicleDAO.class);
	
	protected void initDao() {
		super.initDao();
	}

	public static VehicleDAO getFromApplicationContext(ApplicationContext ctx) {
		return (VehicleDAO) ctx.getBean("VehicleDAO");
	}
}
