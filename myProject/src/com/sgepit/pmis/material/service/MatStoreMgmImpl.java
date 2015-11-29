package com.sgepit.pmis.material.service;

import java.sql.SQLException;
import java.util.List;

import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.equipment.dao.EquipmentDAO;
import com.sgepit.pmis.material.hbm.MatAppbuyMaterial;
import com.sgepit.pmis.material.hbm.MatFrame;
import com.sgepit.pmis.material.hbm.MatGoodsChecksub;
import com.sgepit.pmis.material.hbm.MatStoreIn;
import com.sgepit.pmis.material.hbm.MatStoreInReplace;
import com.sgepit.pmis.material.hbm.MatStoreInsub;
import com.sgepit.pmis.material.hbm.MatStoreOutsub;
import com.sgepit.pmis.material.hbm.MatStoreoutView;
import com.sgepit.pmis.wzgl.hbm.WzBm;
import com.sgepit.pmis.wzgl.hbm.WzCjhpb;
import com.sgepit.pmis.wzgl.hbm.WzCjhxb;
import com.sgepit.pmis.wzgl.hbm.WzCjsxb;


public class MatStoreMgmImpl extends BaseMgmImpl implements MatStoreMgmFacade {

	private EquipmentDAO equipmentDAO;

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static MatStoreMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (MatStoreMgmImpl) ctx.getBean("matStoreMgm");
	}
	// -------------------------------------------------------------------------
	// Setter methods for dependency injection
	// -------------------------------------------------------------------------
	public void setEquipmentDAO(EquipmentDAO equipmentDAO) {
		this.equipmentDAO = equipmentDAO;
	}
	
	public void deleteMatIn(MatStoreInsub matStoreIn) throws SQLException,
		BusinessException {
		this.equipmentDAO.delete(matStoreIn);
	
	}
	public void insertMatIn(MatStoreInsub matStoreIn) throws SQLException,
		BusinessException {
		this.equipmentDAO.insert(matStoreIn);
	
	}
	public void updateMatIn(MatStoreInsub matStoreIn) throws SQLException,
		BusinessException {
		this.equipmentDAO.saveOrUpdate(matStoreIn);
	
	}
	
	public String insertRkd(MatStoreIn matStoreIn)throws SQLException,
		BusinessException {
		return this.equipmentDAO.insert(matStoreIn);
	}
	public boolean updateRkd(MatStoreIn matStoreIn){
		try{
			this.equipmentDAO.saveOrUpdate(matStoreIn);
			return true;
		}catch(Exception e){
			return false;
		}
}
	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------
	
	/**
	 * 从采购合同中选择材料入库
	 * 2010年11月21日 hanhl
	 * inId:入库单主键
	 * ids:物资主键数组
	 */
	public boolean saveStoreInByCon(String inId,String[] ids,String[] cgbh){
		//ids传过来的是物资主键，但新增的物资的主键为uuid
		try{
			for (int i = 0; i < ids.length; i++) {
				MatStoreInsub msi = new MatStoreInsub();
				WzBm mf = (WzBm) this.equipmentDAO.findById("com.sgepit.pmis.wzgl.hbm.WzBm", ids[i]);
				//ids传过来的是物资主键，但新增的物资的主键为uuid格式，和以前数据不同
				if(mf==null){
					mf = (WzBm) this.equipmentDAO.findBeanByProperty("com.sgepit.pmis.wzgl.hbm.WzBm", "bm", ids[i]);
				}
				//从采购计划中查询出用户新修改后的单价
				List<WzCjhxb> wzCjhxbList =  this.equipmentDAO.findByWhere("com.sgepit.pmis.wzgl.hbm.WzCjhxb", "bh ='"+cgbh[i]+"' and bm='"+ids[i]+"'");
				Double price = wzCjhxbList.size()>0 ? wzCjhxbList.get(0).getDj():mf.getJhdj();
				
				String beanName = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT__STORES_INSUB);
				String where = " inId ='" + inId + "' and matId ='" + ids[i] + "'";
				List list = (List)this.equipmentDAO.findByWhere(beanName, where);
				if (list.size() > 0){
					continue;
				}							
				msi.setInId(inId);
				msi.setFormId(cgbh[i]);//2010-12-2从合同清单表查出合同中物资对应的采购计划编号
				msi.setMatId(ids[i]);
				msi.setCatName(mf.getPm());
				msi.setCatNo(mf.getBm());
				msi.setSpec(mf.getGg());
				//msi.setFactory("");
				msi.setMaterial(mf.getWzProperty());
				msi.setUnit(mf.getDw());
				//msi.setPrice(mf.getJhdj());//BUG1560:物资入库时的单价从物资入库时的单价从采购计划中取值（目前程序取的是库存单价）
				msi.setPrice(price);
				msi.setPid(mf.getPid());
				msi.setWareno(mf.getHwh());
				msi.setInType("采购合同");
				equipmentDAO.insert(msi);
			}
			return true;
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * 从采购计划中选择材料入库
	 * 2010年11月22日 zhangh
	 * inId:入库单主键
	 * ids:物资主键数组
	 */
	public boolean saveStoreInByPlan(String inId,String[] uids,String[] ids){
		try{
			for (int i = 0; i < ids.length; i++) {
				MatStoreInsub msi = new MatStoreInsub();
				List<WzBm> listBm = this.equipmentDAO.findByProperty("com.sgepit.pmis.wzgl.hbm.WzBm","bm",ids[i]);
				WzBm mf = new WzBm();
				
				if(listBm.size()>0){
					mf = listBm.get(0);
				}else{
					continue;
				}
				
				WzCjhxb wzCjhxb = new WzCjhxb();
				List<WzCjhxb> listBh = this.equipmentDAO.findByProperty("com.sgepit.pmis.wzgl.hbm.WzCjhxb","uids", uids[i]);
				if(listBh.size()>0){
					wzCjhxb = listBh.get(0);
				}else{
					continue;
				}
				
				//String beanName = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT__STORES_INSUB);
				//String where = " inId ='" + inId + "' and matId ='" + mf.getUids() + "'";
				//List list = (List)this.equipmentDAO.findByWhere(beanName, where);
				//if (list.size() > 0){
				//	continue;
				//}
				
				msi.setInId(inId);
				msi.setFormId(wzCjhxb.getBh());
				msi.setMatId(wzCjhxb.getUids());
				msi.setCatNo(mf.getBm());
				msi.setCatName(mf.getPm());
				msi.setSpec(mf.getGg());
				//msi.setFactory("");
				msi.setMaterial(mf.getWzProperty());
				msi.setUnit(mf.getDw());
				msi.setPrice(wzCjhxb.getDj());
				msi.setWarehouse(mf.getCkh());
				msi.setWareno(mf.getHwh());
				msi.setPid(mf.getPid());
				msi.setInType("采购计划");
				equipmentDAO.insert(msi);
			}
			return true;
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
	}
	
	
	// 选择入库的物资(树)
	public void saveMatFrameTree(String inId, String[] ids) {
		for (int i = 0; i < ids.length; i++) {
			MatStoreInsub msi = new MatStoreInsub();
//			MatFrame mf = (MatFrame) this.equipmentDAO.findById(BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_FRAME), ids[i]);
			WzBm mf = (WzBm) this.equipmentDAO.findById("com.sgepit.pmis.wzgl.hbm.WzBm", ids[i]);
			
			//String beanName = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT__STORES_INSUB);
			//String where = " inId ='" + inId + "' and matId ='" + ids[i] + "'";
			//List list = (List)this.equipmentDAO.findByWhere(beanName, where);
			//if (list.size() > 0){
			//	continue;
			//}
			
			msi.setInId(inId);
			msi.setMatId(ids[i]);
			msi.setCatNo(mf.getBm());
			msi.setCatName(mf.getPm());
			msi.setSpec(mf.getGg());
			//msi.setFactory("");
			msi.setMaterial(mf.getWzProperty());
			msi.setUnit(mf.getDw());
			msi.setPrice(mf.getJhdj());
			msi.setWarehouse(mf.getCkh());
			msi.setWareno(mf.getHwh());
			msi.setPid(mf.getPid());
			msi.setInType("清单");
			equipmentDAO.insert(msi);
		}
	}
	
	//选择入库的物资(grid)  采购单
	public void selectInMatBuy(String inId, String[] matIds, String formId){
		String beanName = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_APPBUY_MATERIAL);
		String bean = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT__STORES_INSUB);
		for (int i=0; i<matIds.length; i++){
			MatAppbuyMaterial mam = (MatAppbuyMaterial)this.equipmentDAO.findById(beanName, matIds[i]);
			MatStoreInsub msi = new MatStoreInsub();
			String where = " inId ='" + inId + "' and matId ='" +mam.getMatId() + "'";
			List list = (List)this.equipmentDAO.findByWhere(bean, where);
			//if (list.size() > 0){
			//	continue;
			//}
			
			msi.setInId(inId);
			msi.setMatId(mam.getMatId());
			msi.setCatNo(mam.getCatNo());
			msi.setCatName(mam.getCatName());
			msi.setSpec(mam.getSpec());
			msi.setFactory(mam.getMaterial());
			msi.setMaterial(mam.getMaterial());
			msi.setUnit(mam.getUnit());
			msi.setPrice(mam.getPrice());
			msi.setWarehouse(mam.getWarehouse());
			msi.setWareno(mam.getWareNo());
			msi.setFormId(formId);
			msi.setAppId(mam.getAppid());
			msi.setInType("采购单");
			this.equipmentDAO.insert(msi);
		}
	}
	
	//选择到货的物资(grid)  到货验收
	public void selectInMatGoods(String inId, String[] matIds, String goodsId){
		String beanName = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_GOODS_CHECKSUB);
		String bean = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT__STORES_INSUB);
		for (int i=0; i<matIds.length; i++){
			MatGoodsChecksub mgc = (MatGoodsChecksub)this.equipmentDAO.findById(beanName, matIds[i]);
			MatStoreInsub msi = new MatStoreInsub();
			String where = " inId ='" + inId + "' and matId ='" + mgc.getMatid() + "'";
			List list = (List)this.equipmentDAO.findByWhere(bean, where);
			if (list.size() > 0){
				continue;
			}
			
			msi.setInId(inId);
			msi.setMatId(mgc.getMatid());
			msi.setCatNo(mgc.getCatNo());
			msi.setCatName(mgc.getCatName());
			msi.setSpec(mgc.getSpec());
			msi.setFactory(mgc.getMaterial());
			msi.setMaterial(mgc.getMaterial());
			msi.setGoodsIn(goodsId);
			msi.setInType("到货单");
			this.equipmentDAO.insert(msi);
		}
	}
	
	// 得到该申请计划中有库存的所有物资
	public List getAppMat(String appId){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = " select t.mat_id from mat_appbuy_material t where t.appid = '"+  appId +"' " ;
		List list = jdbc.queryForList(sql);
		return list;
	}
	
	//选择入库的物资(grid)  申请计划
	public void selectOutMaApp(String outId, String[] matIds, String appId){
		String beanName = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT__STORES_OUTSUBVIEW);
		String bean = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT__STORES_OUTSUB);
		String beanApp = BusinessConstants.MAT_PACKAGE.concat(BusinessConstants.MAT_APPBUY_MATERIAL);
		for (int i=0; i<matIds.length; i++){
			MatStoreoutView msv = (MatStoreoutView)this.equipmentDAO.findById(beanName, matIds[i]);
			String where = " appid ='" + appId + "' and matId = '" + msv.getMatId()  + "'";
			List list = (List)this.equipmentDAO.findByWhere(beanApp, where);
			MatAppbuyMaterial mam = (MatAppbuyMaterial)list.get(0);
			MatStoreOutsub mso = new MatStoreOutsub();
			
			mso.setMatId(msv.getMatId());
			mso.setCatNo(msv.getCatNo());
			mso.setCatName(msv.getCatName());
			mso.setSpec(msv.getSpec());
			mso.setUnit(msv.getUnit());
			mso.setPrice(msv.getPrice());
			mso.setInId(msv.getUuid());
			mso.setAppNum(mam.getAppNum());
			mso.setAppId(appId);
			mso.setOutId(outId);
			this.equipmentDAO.insert(mso);
		}
	}	
	

	/**
	 * 非计划出库 和 计划内领用 选择物资通用方法。
	 * 计划内领用时判断物资是否被替代，如果有替代，则增加替代物资。
	 * @param matStoreOutsub
	 * @return
	 * @author zhangh 2012-11-08
	 */
	public void saveMatStoreOutSub(MatStoreOutsub[] matStoreOutsub){
		for (int i = 0; i < matStoreOutsub.length; i++) {
			this.equipmentDAO.saveOrUpdate(matStoreOutsub[i]);
			// 计划内领用，判断物资是否有替代
			if (matStoreOutsub[i].getOutType() == 4l) {
				List list = this.equipmentDAO.findByWhere(
						MatStoreInReplace.class.getName(),
						"bh='" + matStoreOutsub[i].getAppId() + "' and bm='"
								+ matStoreOutsub[i].getCatNo() + "' and pid='"
								+ matStoreOutsub[i].getPid() + "'");
				if(list.size() > 0){
					for (int j = 0; j < list.size(); j++) {
						MatStoreInReplace replace = (MatStoreInReplace) list.get(j);
						MatStoreOutsub outsub = new MatStoreOutsub();
						//以下为向计划内出库细表中添加替代物资
						outsub.setOutId(matStoreOutsub[i].getOutId());
						outsub.setAppId(replace.getBh());	//申请计划编号
						outsub.setTdUids(replace.getUids());//记录物资到货替代表中替代主键
						//查询替代物资
						List<WzBm> listWz = this.equipmentDAO.findByWhere(WzBm.class.getName(), "bm='"+replace.getTdBm()+"'");
						if(listWz.size() > 0){
							WzBm wzBm = listWz.get(0);
							outsub.setCatNo(replace.getTdBm());
							outsub.setCatName(wzBm.getPm());
							outsub.setSpec(wzBm.getGg());
							outsub.setUnit(wzBm.getDw());
							outsub.setAppNum(0d);
							outsub.setPrice(wzBm.getJhdj());
							outsub.setOutType(5l);	//5 为新增状态，替代物资；
							outsub.setPid(replace.getPid());
						}else{
							//该替代物资库存中不存在，不添加到计划内领用细表
							continue;
						}
						this.equipmentDAO.saveOrUpdate(outsub);
					}
				}
			}
		}
	}
	

	/**
	 * 选择替代物资
	 * @param tdBmArr
	 * @param bh
	 * @param bm
	 * @param pid
	 * @return
	 * @author zhangh 2012-11-06
	 */
	public String getTdWz(String[] tdBmArr, String bh, String bm, String pid) {
		List list = this.equipmentDAO.findByWhere(WzCjsxb.class.getName(),
				"bh='" + bh + "' and bm='" + bm + "' and pid='" + pid + "'");
		if (list.size() > 0) {
			WzCjsxb cjsxb = (WzCjsxb) list.get(0);
			for (int i = 0; i < tdBmArr.length; i++) {
				MatStoreInReplace replace = new MatStoreInReplace();
				replace.setBh(bh);
				replace.setBm(bm);
				replace.setTdBm(tdBmArr[i]);
				replace.setTdNum(0d);
				replace.setPid(pid);
				this.equipmentDAO.insert(replace);
			}
			return "1";
		} else {
			return "0";
		}
	}
	
	
	/**
	 * 保存替代物资
	 * @param replaces
	 * @param bh
	 * @param bm
	 * @param pid
	 * @return
	 * @author zhangh 2012-11-06
	 */
	public String saveTdWz(MatStoreInReplace[] replaces, String bh, String bm,
			String pid) {
		List list = this.equipmentDAO.findByWhere(WzCjsxb.class.getName(),
				"bh='" + bh + "' and bm='" + bm + "' and pid='" + pid + "'");
		Double d = 0d;
		if (list.size() > 0) {
			WzCjsxb cjsxb = (WzCjsxb) list.get(0);
			for (int i = 0; i < replaces.length; i++) {
				this.equipmentDAO.saveOrUpdate(replaces[i]);
			}
			cjsxb.setIsTd("1");
			List<MatStoreInReplace> l = this.equipmentDAO.findByWhere(
					MatStoreInReplace.class.getName(), "bh='" + bh
							+ "' and bm='" + bm + "' and pid='" + pid + "'");
			for (int i = 0; i < l.size(); i++) {
				d += l.get(i).getTdNum();
			}
			cjsxb.setTdTotalNum(d);
			this.equipmentDAO.saveOrUpdate(cjsxb);
			return "1";
		} else {
			return "0";
		}
	}
	
	
	/**
	 * 删除替代物资
	 * @param uidsArr
	 * @param bh
	 * @param bm
	 * @param pid
	 * @return
	 * @author zhangh 2012-11-06
	 */
	public String deleteTdWz(String[] uidsArr, String bh, String bm, String pid) {
		List list = this.equipmentDAO.findByWhere(WzCjsxb.class.getName(),
				"bh='" + bh + "' and bm='" + bm + "' and pid='" + pid + "'");
		if (list.size() > 0) {
			WzCjsxb cjsxb = (WzCjsxb) list.get(0);
			Double d = cjsxb.getTdTotalNum();
			StringBuffer sb = new StringBuffer();
			for (int i = 0; i < uidsArr.length; i++) {
				MatStoreInReplace replace = (MatStoreInReplace) this.equipmentDAO
						.findById(MatStoreInReplace.class.getName(), uidsArr[i]);
				//删除前判断该物资是否被领用
				List<MatStoreOutsub> outSubList = this.equipmentDAO
						.findByWhere(MatStoreOutsub.class.getName(), "tdUids='"
								+ uidsArr[i] + "'");
				if(outSubList.size() > 0){
					sb.append(replace.getTdBm()).append(",");
					continue;
				}else{
					//删除替代物资，并减去替代数量
					if(replace != null){
						d -= replace.getTdNum();
						this.equipmentDAO.delete(replace);
					}
				}
			}
			cjsxb.setTdTotalNum(d);
			List replaceList = this.equipmentDAO.findByWhere(
					MatStoreInReplace.class.getName(), "bh='" + bh
							+ "' and bm='" + bm + "' and pid='" + pid + "'");
			//如果替代物资都被删除，则更新申请计划细表中物资替代状态
			if(replaceList.size() == 0){
				cjsxb.setIsTd("0");
			}
			this.equipmentDAO.saveOrUpdate(cjsxb);
			if(sb.toString().equals("")){
				return "1";
			}else{
				return sb.toString();
			}
		}else{
			return "0";
		}
	}
}

