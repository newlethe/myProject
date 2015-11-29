package com.sgepit.pmis.vehicle.service;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.NumberFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import oracle.sql.BLOB;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pcmis.common.hbm.PcBusniessBack;
import com.sgepit.pmis.vehicle.dao.VehicleDAO;

public class VehicleMgmImpl extends BaseMgmImpl implements VehicleMgmFacade {

	private VehicleDAO vehicleDAO;
	
	public VehicleDAO getVehicleDAO() {
		return vehicleDAO;
	}

	public void setVehicleDAO(VehicleDAO vehicleDAO) {
		this.vehicleDAO = vehicleDAO;
	}

	public static VehicleMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (VehicleMgmImpl) ctx.getBean("vehicleMgm");
	}

	/**
	 * 根据业务类型，获取最新的数据导出word模板信息；
	 * @param businessType
	 * @return
	 */
	public InputStream getExcelTemplate(String businessType) {
		InputStream ins = null;
		String templateSql = "select fileid from app_template t where templatecode='" + businessType + "' order by lastmodify desc";
		List<Map<String, String>> l = JdbcUtil.query(templateSql);
		String templateFileId = "";
		if (l.size()>0) {
			templateFileId = l.get(0).get("fileid");
		}
		if (templateFileId!=null && templateFileId.length()>0) {
			try {
				Context initCtx = new InitialContext();
				DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
				Connection conn = ds.getConnection();
				Statement stmt = conn.createStatement();
				ResultSet rs = null;
				rs = stmt.executeQuery("SELECT BLOB FROM APP_BLOB WHERE FILEID ='"+templateFileId+"'");
				if(rs.next()) {
					BLOB blob = (BLOB) rs.getBlob(1);
					ins = blob.getBinaryStream();
				}
				rs.close() ;
				stmt.close() ;
				conn.close() ;
				initCtx.close() ;
				
			} catch (Exception ex) {
				ex.printStackTrace();
				return null ;
			}
		}
		return ins;
	}

	/**获取某个表编号的最大值
	 * @param prefix:编号前缀
	 * @param col: 列名称
	 * @param table: 表名称
	 * @param lsh：最大的流水号（null，表示没有传入，需要从数据库中获取）
	 * @return
	 */
	public String getVehicleApplyNewBh(String prefix, String col, String table,
			Long lsh) {
		String bh = "";
		String newLsh = "";
		if (lsh == null) {
			String sql = "select trim(to_char(nvl(max(substr(" + col
					+ ",length('" + prefix + "') +1, 4)),0) +1,'0000')) from "
					+ table + " where substr("
					+ col + ",1,length('" + prefix + "')) ='" + prefix + "'";
			List<String> list = vehicleDAO.getDataAutoCloseSes(sql);
			if (list != null) {
				newLsh = list.get(0);
			}
		} else {
			NumberFormat ft = NumberFormat.getNumberInstance();
			ft.setMinimumIntegerDigits(4);
			ft.setGroupingUsed(false);
			newLsh = ft.format(lsh);

		}
		bh = prefix.concat(newLsh);
		return bh;
	}

	/**
	 * 插入流转记录
	 * @param pcBusniessBack PcBusniessBack对象
	 */
	public String insertBuniessBack(PcBusniessBack pcBusniessBack) {
		try {
			Date date = new Date();
			pcBusniessBack.setBackDate(date);
			vehicleDAO.insert(pcBusniessBack);
		} catch (Exception e) {
			e.printStackTrace();
			return "ERROR";
		}
		
		return "OK";
	}
}
