package com.sgepit.pmis.wzgl.service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.wzgl.dao.ViewWzCollectApplyDAO;
import com.sgepit.pmis.wzgl.dao.WZglDAO;
import com.sgepit.pmis.wzgl.hbm.ConMat;
import com.sgepit.pmis.wzgl.hbm.ViewWzArriveCgjh;
import com.sgepit.pmis.wzgl.hbm.ViewWzCjsxbPb;
import com.sgepit.pmis.wzgl.hbm.ViewWzCollectApply;
import com.sgepit.pmis.wzgl.hbm.ViewWzConCgjh;
import com.sgepit.pmis.wzgl.hbm.WzArriveApply;
import com.sgepit.pmis.wzgl.hbm.WzBm;
import com.sgepit.pmis.wzgl.hbm.WzCdjinPb;
import com.sgepit.pmis.wzgl.hbm.WzCjhpb;
import com.sgepit.pmis.wzgl.hbm.WzCjhxb;
import com.sgepit.pmis.wzgl.hbm.WzCjspb;
import com.sgepit.pmis.wzgl.hbm.WzCjspbHz;
import com.sgepit.pmis.wzgl.hbm.WzCjspbHzSub;
import com.sgepit.pmis.wzgl.hbm.WzCjsxb;
import com.sgepit.pmis.wzgl.hbm.WzInput;
import com.sgepit.pmis.wzgl.hbm.WzKcZy;
import com.sgepit.pmis.wzgl.hbm.WzKcZyId;
import com.sgepit.pmis.wzgl.hbm.WzUser;

public class StockMgmImpl extends BaseMgmImpl implements StockMgmFacade {
	private ViewWzCollectApplyDAO viewWzCollectApplyDAO;
	private WZglDAO wzglDAO;

	public ViewWzCollectApplyDAO getViewWzCollectApplyDAO() {
		return viewWzCollectApplyDAO;
	}

	public void setViewWzCollectApplyDAO(ViewWzCollectApplyDAO viewWzCollectApplyDAO) {
		this.viewWzCollectApplyDAO = viewWzCollectApplyDAO;
	}

	public WZglDAO getWzglDAO() {
		return wzglDAO;
	}

	public void setWzglDAO(WZglDAO wzglDAO) {
		this.wzglDAO = wzglDAO;
	}

	public static StockMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (StockMgmImpl) ctx.getBean("StockMgm");
	}
	
	/**
	 * 从session获取pid
	 * @return
	 */
	public String getPid() {
		String pid = "";
		WebContext webContext = WebContextFactory.get();    
		if(webContext!=null){
			HttpSession session = webContext.getSession() ;
			//通过session获取pid，可以不从前台传递
			pid = session.getAttribute(Constant.CURRENTAPPPID).toString(); 
		}
		return pid;
	}

	/**获取汇总申请计划列表
	 * @param whereStr
	 * @param start
	 * @param limit
	 * @return List
	 */
	public List<ViewWzCollectApply> getCollectApply(String whereStr,Integer start, Integer limit){
		return viewWzCollectApplyDAO.getCollectApply(whereStr, start, limit);
	}
	
	/**汇总选择的申请计划，生成采购计划，同时更新申请计划表中的采购计划编号和计划人
	 * @param stockBh:采购计划编号
	 * @param bmStr,多个物资编码 以;分隔
	 * @param applyBHStr:多个申请计划编号','分隔，Example: '123','BBB'
	 * @param ygslStr 应采购数量，以,分隔
	 * @return 
	 */
	public boolean collectApplyAndCreateStock(String stockBh,String bmStr, String applyBhStr){
		boolean success = false;
		String[] bm = bmStr.split(";");
		String[] applyBh = applyBhStr.split(";");
		for (int index=0;index<bm.length;index++){
			String sqlCjsxb = "Select max(wz_cjsxb.PM),max(wz_cjsxb.GG),max(wz_cjsxb.DW),max(wz_cjsxb.DJ),"
				+ "sum(wz_cjsxb.SL),min(wz_cjsxb.XQRQ),	MAX(wz_cjsxb.BZ),max(wz_cjspb.sqr) "
				+ "from wz_cjsxb,wz_cjspb where wz_cjsxb.bm='" + bm[index] + "' "
				+ "and wz_cjsxb.bh in (" +  applyBh[index] + ") "
				+ "and wz_cjsxb.bh = wz_cjspb.bh(+) group by wz_cjsxb.bm";
			List<Object[]> collectList =  viewWzCollectApplyDAO.getDataAutoCloseSes(sqlCjsxb);	
			
			String sql_v = "select kysl from view_wz_collect_apply where bm ='"+bm[index]+"'";
			List kyslList =   viewWzCollectApplyDAO.getDataAutoCloseSes(sql_v);	
			if(collectList!= null && collectList.size()>0){				
				Object[] obj = collectList.get(0);
				WzCjhxb cjhxbHbm = new WzCjhxb();
				cjhxbHbm.setPid(this.getPid());
				cjhxbHbm.setBh(stockBh);
				cjhxbHbm.setBm(bm[index]);
				cjhxbHbm.setBz(obj[6] == null?"":(String)obj[6]);
				cjhxbHbm.setDj(obj[3] == null? null:((BigDecimal)obj[3]).doubleValue());
				cjhxbHbm.setDw(obj[2] == null?"":(String)obj[2]);
				cjhxbHbm.setGg(obj[1] == null?"":(String)obj[1]);		
				cjhxbHbm.setPm(obj[0] == null?"":(String)obj[0]);
				cjhxbHbm.setSqr(obj[7] == null?"":(String)obj[7]);
				cjhxbHbm.setXqrq(obj[7] == null?null:(Date)obj[5]);				
				//可用库存、申请汇总数量、应采购数量
				//double kysl = getUsedMatStorage(bm[index]);
				double kysl = 0;
				if(kyslList!=null && kyslList.size()>0){
					kysl = ((BigDecimal)kyslList.get(0)).doubleValue();
				}
				double hzsl = obj[4] == null? 0:((BigDecimal)obj[4]).doubleValue();
				double ygsl = hzsl - kysl;
				
				cjhxbHbm.setKcsl(kysl);
				cjhxbHbm.setHzsl(hzsl);
				cjhxbHbm.setYgsl(ygsl<0?0:ygsl);
				//应采购数量>0,设置为”“，否则设置为3，不需采购
				cjhxbHbm.setXz(ygsl>0?"":"3");				
				viewWzCollectApplyDAO.insert(cjhxbHbm);
				String where =  "bm='" + bm[index] +"' and bh in (" + applyBh[index]+")";
				List<WzCjsxb> listCjsxb= viewWzCollectApplyDAO.findByWhere("com.sgepit.pmis.wzgl.hbm.WzCjsxb", where,"xqrq");
				for(int i =0; i<listCjsxb.size(); i++){
					WzCjsxb cjsxbHbm = listCjsxb.get(i);
					double sqsl = cjsxbHbm.getSl()==null?0:cjsxbHbm.getSl().doubleValue();
					double ftsl = cjsxbHbm.getFtsl()==null?0:cjsxbHbm.getFtsl().doubleValue();
					cjsxbHbm.setJhbh(stockBh);
					viewWzCollectApplyDAO.saveOrUpdate(cjsxbHbm);
					
					WzKcZy kczyHbm = new WzKcZy();
					WzKcZyId kczyId = new WzKcZyId();
					kczyId.setBh(cjsxbHbm.getBh());
					kczyId.setBm(bm[index]);
					
					kczyId.setFpbh("storage");
					kczyHbm.setIfZy("1");
					
					if(kysl >0){
						if(kysl > sqsl){						
							kczyHbm.setSl(cjsxbHbm.getSl());
							kczyHbm.setId(kczyId);	
								
							viewWzCollectApplyDAO.saveOrUpdate(kczyHbm);
							
							cjsxbHbm.setFtsl(ftsl + sqsl);
							viewWzCollectApplyDAO.saveOrUpdate(cjsxbHbm);						
							kysl = kysl - sqsl;
						} else{
							kczyHbm.setSl(kysl);
							kczyHbm.setId(kczyId);							
							viewWzCollectApplyDAO.saveOrUpdate(kczyHbm);
							cjsxbHbm.setFtsl(ftsl + kysl);
							viewWzCollectApplyDAO.saveOrUpdate(cjsxbHbm);
							kysl = kysl - sqsl;
						}
					}
				}
				
			}
			success = true;
		}
		

		
		return success;
	}
	/**删除一份采购采购计划
	 * @param uids：采购计划的主键uids
	 * @return
	 */
	public boolean deleteStockPlan(String uids){
		boolean success = false;
		try{
			Object obj  = viewWzCollectApplyDAO.findById("com.sgepit.pmis.wzgl.hbm.WzCjhpb", uids);
			if(obj!=null){
				WzCjhpb cjhpbHbm = (WzCjhpb)obj;
				List<WzCjhxb> listCjhxb = viewWzCollectApplyDAO.findByWhere("com.sgepit.pmis.wzgl.hbm.WzCjhxb", "bh='" + cjhpbHbm.getBh()+ "'");
				if(listCjhxb!= null){
					String docIDs = "";
					for (int i = 0; i < listCjhxb.size(); i++) {				
						docIDs += "`" + listCjhxb.get(i).getUids();							
					}
					if(docIDs.length()>0) {
						docIDs = docIDs.substring(1);
					}
					deleteStockPlanMat(docIDs);
				}
				viewWzCollectApplyDAO.delete(cjhpbHbm);
			}			
			success = true;
			
		} catch (Exception e) {
			e.printStackTrace();
			success = false;
		}
		
		
		
		return success;
	}
	/**删除采购计划的物资清单
	 * @param uids：物资清单的主键，以`进行分割
	 * @return
	 */
	public boolean deleteStockPlanMat(String uids){
		boolean success = false;
		String[] uidArr = uids.split("`");
		try {
			for (int i = 0; i < uidArr.length; i++) {
				Object obj = viewWzCollectApplyDAO.findById("com.sgepit.pmis.wzgl.hbm.WzCjhxb", uidArr[i]);
				if(obj!=null){
					WzCjhxb cjhxbHbm = (WzCjhxb)obj;
					String bm = cjhxbHbm.getBm();
					String bh = cjhxbHbm.getBh();
					
					//修改申请计划表中物资状态
					List<WzCjsxb> cjsxbList = viewWzCollectApplyDAO.findByWhere("com.sgepit.pmis.wzgl.hbm.WzCjsxb", "jhbh='"+bh+"' and bm='"+bm+"'");
					//修改申请计划汇总表中物资状态
					List<WzCjspbHzSub> hzSubList = this.wzglDAO.findByWhere("com.sgepit.pmis.wzgl.hbm.WzCjspbHzSub", "jhbh='"+bh+"' and bm='"+bm+"'");
					if(cjsxbList!=null ){
						for (int index=0;index<cjsxbList.size();index++){
							WzCjsxb cjsxbHbm = cjsxbList.get(index);
							cjsxbHbm.setJhbh("");			//删除采购计划物资时修改申请计划中JHBH（采购计划编号为空）
							cjsxbHbm.setCghzState("0");		//删除采购计划物资时修改申请计划中CGHZ_STATE（采购状态为0）
							//删除物资占用比表对应数据
							WzKcZyId kczyId= new WzKcZyId();
							//kczyId.setBh(cjsxbHbm.getUids());
							kczyId.setBh(cjsxbHbm.getBh());
							kczyId.setBm(bm);
							kczyId.setFpbh("storage");							
							Object objKcZy = viewWzCollectApplyDAO.findByCompId("com.sgepit.pmis.wzgl.hbm.WzKcZy", kczyId);
							if(objKcZy!=null){
								WzKcZy kczyHbm = (WzKcZy)objKcZy;
								double kczySl = (kczyHbm.getSl()==null?0:kczyHbm.getSl().doubleValue());
								if(cjsxbHbm.getFtsl()!=null && cjsxbHbm.getFtsl().doubleValue() >=  kczySl){
									cjsxbHbm.setFtsl( new Double(cjsxbHbm.getFtsl().doubleValue() - kczySl ));
								}
								viewWzCollectApplyDAO.delete(kczyHbm);								
							}
							
							viewWzCollectApplyDAO.saveOrUpdate(cjsxbHbm);						
						}
					}
					if(hzSubList!=null){
						for (int j = 0; j < hzSubList.size(); j++) {
							WzCjspbHzSub hzSub = hzSubList.get(j);
							hzSub.setJhbh("");
							hzSub.setCghzState("0");
							
							this.wzglDAO.saveOrUpdate(hzSub);
						}
					}
					viewWzCollectApplyDAO.delete((WzCjhxb)obj);
				}
			}
			success = true;
		} catch (Exception e) {
			e.printStackTrace();
			success = false;
		}
		
		return success;
	}
	/**
	 * @param prefix:编号前缀
	 * @param col: 列名称
	 * @param table: 表名称
	 * @param lsh：最大的流水号（null，表示没有传入，需要从数据库中获取）
	 * @return
	 */
	public String getStockPlanNewBh(String prefix, String col, String table,
			Long lsh) {
		String bh = "";
		String newLsh = "";
		if (lsh == null) {
			String sql = "select trim(to_char(nvl(max(substr(" + col
					+ ",length('" + prefix + "') +1, 4)),0) +1,'0000')) from "
					+ table + " where pid = '" + getPid() + "' and  substr("
					+ col + ",1,length('" + prefix + "')) ='" + prefix + "'";
			List<String> list = viewWzCollectApplyDAO.getDataAutoCloseSes(sql);
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

	// session中无法获取pid时调用此方法，通过前台传递pid
	// 通过DWR调用的方法，后台可以通过this.getPid()获取pid
	public String getStockPlanNewBhNoSession(String prefix, String col,
			String table, Long lsh, String pid) {
		String bh = "";
		String newLsh = "";
		if (lsh == null) {
			String sql = "select trim(to_char(nvl(max(substr(" + col
					+ ",length('" + prefix + "') +1, 4)),0) +1,'0000')) from "
					+ table + " where pid = '" + pid + "' and  substr(" + col
					+ ",1,length('" + prefix + "')) ='" + prefix + "'";
			List<String> list = viewWzCollectApplyDAO.getDataAutoCloseSes(sql);
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
	
	/**到货时，列出采购计划的物资清单
	 * @param where:where条件
	 * @param order: 排序列
	 * @return List<ViewWzArriveCgjh>
	 */
	public List<ViewWzArriveCgjh>getArriveCgjh(String where,String order,Integer start, Integer limit){
		return this.wzglDAO.getArriveCgjh(where,order,start,limit);

	}
	
	/**采购合同录入时，列出采购计划的物资清单
	 * @param where:where条件
	 * @param order: 排序列
	 * @return List<ViewWzArriveCgjh>
	 */
	public List<ViewWzArriveCgjh>getConCgjh(String where,String order,Integer start, Integer limit){
		return this.wzglDAO.getConCgjh(where,order,start,limit);

	}
	/** 根据到货记录生成到货入库单
	 * @param arriveBh：到货记录编号
	 * @param fph：发票号
	 * @return boolean（是否成功）
	 */
	public boolean arriveAndCreateInput(ViewWzArriveCgjh hbm, WzCdjinPb cdjInPbHbm, String fph, String rkbh, String pid){
		boolean success = true;
		try{
			Object obj = this.wzglDAO.findById("com.sgepit.pmis.wzgl.hbm.WzCjhxb", hbm.getUids());		
			if(obj!=null){			
				WzCjhxb cjhxbHbm = (WzCjhxb)obj;
				cjhxbHbm.setTaxRate(hbm.getTaxRate());
				cjhxbHbm.setSjdj(hbm.getSjdj());
				cjhxbHbm.setCsdm(cdjInPbHbm.getGhdw());
				double dhsl = (cjhxbHbm.getDhsl() == null? 0:cjhxbHbm.getDhsl().doubleValue());
				double curDhsl = (hbm.getCurDhsl() == null? 0:hbm.getCurDhsl().doubleValue());
				//cjhxbHbm.setDhsl(new Double(dhsl + curDhsl));
				
				WzInput inputHbm = new WzInput();
				inputHbm.setBh(rkbh);
				inputHbm.setPid(pid);
				inputHbm.setBillname("验收入库单");
				inputHbm.setHth(hbm.getHth()==null || hbm.getHth().equals("")?"":hbm.getHth());
				inputHbm.setBm(hbm.getBm());
				inputHbm.setPm(hbm.getPm());
				inputHbm.setGg(hbm.getGg());
				inputHbm.setDw(hbm.getDw());
				inputHbm.setSqsl(hbm.getCurDhsl());
				inputHbm.setJhdj(hbm.getJhdj());
				inputHbm.setSjdj(hbm.getSjdj());
				inputHbm.setJhdj(hbm.getJhdj());
				List<WzCjsxb> listCjsxb = this.wzglDAO.findByWhere3("com.sgepit.pmis.wzgl.hbm.WzCjsxb", "bm='" +hbm.getBm() + "' and jhbh='" + hbm.getBh()+ "'","xqrq");
				String applyBh ="";
				if(listCjsxb!= null){
					for (int i=0; i<listCjsxb.size();i++){
						applyBh =  applyBh+ "," + listCjsxb.get(i).getBh();
					}
				}
				if(applyBh.length()>0){
					applyBh =  applyBh.substring(1);
				}
				//申请计划编号
				inputHbm.setJhbh(applyBh);
				inputHbm.setCgbh(hbm.getBh());
				inputHbm.setBillType("到货");
				Object objBm = this.wzglDAO.findBeanByProperty("com.sgepit.pmis.wzgl.hbm.WzBm", "bm",hbm.getBm());
				if(objBm!=null){
					WzBm wzHbm = (WzBm)objBm;
					inputHbm.setCkh(wzHbm.getCkh());
				}			
				inputHbm.setGhdw(cdjInPbHbm.getGhdw());
				//主表编号
				inputHbm.setPbbh(cdjInPbHbm.getBh());
				inputHbm.setZjbh(fph);
				Date curDate = new Date();
				inputHbm.setRq(curDate);
				inputHbm.setZdrq(curDate);
				inputHbm.setQrrq(curDate);
				inputHbm.setBillState("N");
				inputHbm.setSv(hbm.getTaxRate());
				wzglDAO.saveOrUpdate(inputHbm);
				wzglDAO.saveOrUpdate(cjhxbHbm);
			}
		} catch(Exception e){
			e.printStackTrace();
			success = false;
		}			
		return success;
	}
	
	public WzCdjinPb getWzCdjInPb(String uids){
		return (WzCdjinPb)this.wzglDAO.findById("com.sgepit.pmis.wzgl.hbm.WzCdjinPb", uids);
	}
	
	/** 根据到货记录生成到货入库单
	 * @param uis：主键
	 * @@return WzInput
	 */
	public WzInput getArriveMatByID(String uids){
		return (WzInput)this.wzglDAO.findById("com.sgepit.pmis.wzgl.hbm.WzInput", uids);
	}
	
	
	public List getArriveApply(String whereStr,String arriveBh,String sort){
		List<ViewWzCjsxbPb> cjsxbList = this.wzglDAO.findByWhere3("com.sgepit.pmis.wzgl.hbm.ViewWzCjsxbPb", whereStr,sort);
		List listDest = new ArrayList<WzArriveApply>();
		for(int i=0;i<cjsxbList.size();i++){
			WzArriveApply dest  = new WzArriveApply();
			ViewWzCjsxbPb source = cjsxbList.get(i);
			BeanUtils.copyProperties(source,dest);
			WzKcZyId id = new WzKcZyId();
			id.setBh(source.getBh());
			id.setBm(source.getBm());
			id.setFpbh(arriveBh);
			Object obj = this.wzglDAO.findByCompId("com.sgepit.pmis.wzgl.hbm.WzKcZy", id);
			if(obj!= null){
				WzKcZy kczyHbm = (WzKcZy)obj;
				dest.setCurDhsl(kczyHbm.getSl());
				dest.setFtsl(new Double((dest.getFtsl()==null?0:dest.getFtsl().doubleValue()) + (kczyHbm.getSl() ==null?0:kczyHbm.getSl().doubleValue())));
			}
			listDest.add(dest);	
		}
		listDest.add(cjsxbList.size());
		return listDest;
		
	}
	
	
	public boolean saveArriveApply(WzArriveApply item,String arriveBh){
		boolean success = true;
		String uids = item.getUids();
		Object obj = this.wzglDAO.findById("com.sgepit.pmis.wzgl.hbm.WzCjsxb", uids);
		if(obj!=null){
			WzCjsxb hbm = (WzCjsxb)obj;
			double ftsl=  (item.getFtsl()==null?0:item.getFtsl().doubleValue()) +(item.getCurDhsl()==null?0:item.getCurDhsl().doubleValue());
			double ftsl_=  (item.getFtsl()==null?0:item.getFtsl().doubleValue());
			hbm.setFtsl(ftsl_);
			hbm.setIsvalid(ftsl+"");
			WzKcZyId id = new WzKcZyId(item.getBh(), item.getBm(),  arriveBh);
			Object objKczy = this.wzglDAO.findByCompId("com.sgepit.pmis.wzgl.hbm.WzKcZy", id);
			WzKcZy hbmKczy = null;
			if(objKczy==null){
				hbmKczy= new WzKcZy();
				hbmKczy.setId(id);
				hbmKczy.setIfZy("1");
			} else{
				hbmKczy = (WzKcZy)objKczy;
			}
			hbmKczy.setSl(item.getCurDhsl());
			hbm.setPid(item.getPid());
			this.wzglDAO.saveOrUpdate(hbm);
			this.wzglDAO.saveOrUpdate(hbmKczy);
		}
		return success;
	}
	
	public boolean saveArriveMat(WzInput item){
		boolean success = true;
		String uids = item.getUids();
		Object objInput = this.wzglDAO.findById("com.sgepit.pmis.wzgl.hbm.WzInput", uids);
		if(objInput!=null){
			WzInput hbmInput = (WzInput)objInput;
			hbmInput.setZjbh(item.getZjbh());
			hbmInput.setSqsl(item.getSqsl());
			hbmInput.setSjdj(item.getSjdj());
			hbmInput.setSv(item.getSv());
			hbmInput.setSl(item.getSqsl());
			hbmInput.setJhzj(item.getJhzj());
			hbmInput.setBillType("计划入库");
			hbmInput.setBillState("N");
			this.wzglDAO.saveOrUpdate(hbmInput);
			List<WzCjhxb> listCjhxb= this.wzglDAO.findByWhere2("com.sgepit.pmis.wzgl.hbm.WzCjhxb", "bh='" + item.getCgbh()+ "' and bm ='" + item.getBm()+ "'");
			if(listCjhxb != null){
				for(int i =0;i<listCjhxb.size();i++){
					WzCjhxb cjhxbHbm = listCjhxb.get(i);
					double dhsl=cjhxbHbm.getDhsl()==null?0:cjhxbHbm.getDhsl();
					cjhxbHbm.setDhsl(item.getSqsl()+ dhsl);
					cjhxbHbm.setSjdj(item.getSjdj());
					cjhxbHbm.setTaxRate(item.getSv());	
					cjhxbHbm.setHth(item.getHth());
					this.wzglDAO.saveOrUpdate(cjhxbHbm);
				}
			}
		}
		return success;
	}
	
	/*
	 * 通用删除方法，子类不可使用 (non-Javadoc)
	 * 
	 * @see com.ocean.webpmis.domain.business.BaseMgmFacade#delete(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String[])
	 */
	public Integer deleteArriveMat(String[] ida) throws Exception {
		int c = 0;
		for (int i = 0; i < ida.length; i++) {
			Object temp = this.wzglDAO.findById("com.sgepit.pmis.wzgl.hbm.WzInput", ida[i]);
			if (temp != null) {
				WzInput inputHbm = (WzInput)temp;
				List listCjhxb = this.wzglDAO.findByWhere2("com.sgepit.pmis.wzgl.hbm.WzCjhxb", "bh='" +inputHbm.getCgbh() + "' and bm='" +inputHbm.getBm()+"'" );
				if(listCjhxb!=null){
					for(int index=0;index<listCjhxb.size();index++){
						//更新采购计划到货物资数量
						WzCjhxb cjhxbHbm = (WzCjhxb)listCjhxb.get(index);
						double dhslOld  = cjhxbHbm.getDhsl() ==null?0:cjhxbHbm.getDhsl().doubleValue();
						double dhslCur = inputHbm.getSqsl()==null?0: inputHbm.getSqsl().doubleValue();
						double dhslNew = (dhslOld - dhslCur <0?0:dhslOld - dhslCur);
						if(!inputHbm.getBillType().equals("到货")){
							cjhxbHbm.setDhsl(new Double(dhslNew));
						}
						this.wzglDAO.saveOrUpdate(cjhxbHbm);			
						//更新需用计划到货分摊记录，删除到货分摊占用记录
						List listCjsxb= this.wzglDAO.findByWhere2("com.sgepit.pmis.wzgl.hbm.WzCjsxb", "jhbh='" +inputHbm.getCgbh() + "' and bm='" +inputHbm.getBm()+"'" );
						if(listCjsxb!=null){
							for(int j=0;j<listCjsxb.size();j++){
								WzCjsxb cjsxbHbm = (WzCjsxb)listCjsxb.get(j);
								WzKcZyId comid = new WzKcZyId(cjsxbHbm.getBh(), cjsxbHbm.getBm(), inputHbm.getPbbh());
								Object wzKcZyObj =  this.wzglDAO.findByCompId("com.sgepit.pmis.wzgl.hbm.WzKcZy", comid);
								if(wzKcZyObj!= null){
									WzKcZy wzKcZyHbm = (WzKcZy)wzKcZyObj;
									double ftslCur = wzKcZyHbm.getSl() ==null?0:wzKcZyHbm.getSl().doubleValue();
									double ftslOld = cjsxbHbm.getFtsl()==null?0:cjsxbHbm.getFtsl().doubleValue();
									double ftslNew = ftslOld -ftslCur <0?0:ftslOld -ftslCur;
									//cjsxbHbm.setFtsl(new Double(ftslNew));	
									this.wzglDAO.saveOrUpdate(cjsxbHbm);
									this.wzglDAO.delete(wzKcZyHbm);
								}
							}
						}
					}
				}
				//删除到货入库物资清单
				 this.wzglDAO.delete(inputHbm);
				c++;
			}
		}
		return c;
	}
	
	private double getUsedMatStorage(String bm){
		 String sqlBM = "Select sl  From wz_bm where bm= '" +bm + "'";
		 //已分摊未领用
		 String sqlApply ="Select Sum(nvl(WZ_cjsxb.ftsl,0) - nvl(WZ_cjsxb.ffsl,0)) From WZ_cjsxb,WZ_cjspb Where WZ_cjsxb.bh=WZ_cjspb.bh "
			 			 +"And WZ_cjspb.bill_state = 1 and wz_cjsxb.isvalid = 1	And nvl(WZ_cjsxb.ftsl,0) - nvl(WZ_cjsxb.ffsl,0) > 0 "
			 			 +"And WZ_cjsxb.bm='" + bm +"'";
		 //已到货未入库
		 String sqlInput = " Select nvl(sum(SQSL),0)  From WZ_INPUT Where BILL_TYPE='N' and  BM='" + bm +"'";
		 List<BigDecimal> listKc =  viewWzCollectApplyDAO.getDataAutoCloseSes(sqlBM);
		 List<BigDecimal> listAppky =  viewWzCollectApplyDAO.getDataAutoCloseSes(sqlApply);
		 List<BigDecimal> listInput =  viewWzCollectApplyDAO.getDataAutoCloseSes(sqlInput);
		 double kcsl = 0;
		 double ftWlySl = 0;
		 double inputSl = 0;
		 if(listKc!= null && listKc.size()>0){
			 kcsl = (listKc.get(0)==null?0: listKc.get(0).doubleValue());
		 }
		 if(listAppky!= null && listAppky.size()>0){
			 ftWlySl = (listAppky.get(0) ==null? 0: listAppky.get(0).doubleValue());
		 }
		 if(listInput!= null && listInput.size()>0){
			 inputSl = (listInput.get(0) == null? 0:listInput.get(0).doubleValue());
		 }		 

		 return (kcsl + inputSl - ftWlySl <0?0:kcsl + inputSl - ftWlySl);
		 
	}
	public String addOrUpdateWzCjspb(WzCjspb cjspb) {
		String flag = "0";
		try{
			if("".equals(cjspb.getUids())||cjspb.getUids()==null){//新增
				/*if ("Thu Jan 01 08:00:00 CST 1970".equals(cjspb.getPzrq().toString())){
					cjspb.setPzrq(null);
				}*/
				/**
				 * 2014-04-10  qiupy  申请计划不受流程状态的影响，所以新增即为已审批
				 */
//				cjspb.setBillState("0");//新增默认为新计划，未发起流程
				this.wzglDAO.insert(cjspb);
				flag="1";
			}else{//修改
				this.wzglDAO.saveOrUpdate(cjspb);
				flag = "2";
			}
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}

	public boolean checkBHno(String bh) {
		try{
			List list = this.wzglDAO.findByProperty("com.sgepit.pmis.wzgl.hbm.WzCjspb", "bh", bh);
			if(list.size()>0) return false;
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	public boolean wzcjsxbSelectWz(String bh,WzBm [] wzbarr) {
		try{
			for(int i =0; i<wzbarr.length;i++){
				WzCjsxb xb = new WzCjsxb();
				xb.setBh(bh);
				xb.setBm(wzbarr[i].getBm());
				xb.setDw(wzbarr[i].getDw());
				xb.setGg(wzbarr[i].getGg());
				xb.setPm(wzbarr[i].getPm());
				xb.setDj(wzbarr[i].getJhdj());
				xb.setSqhzState("0");
				xb.setCghzState("0");
				xb.setPid(wzbarr[i].getPid());
				this.wzglDAO.insert(xb);
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		
	}
	
	public List<WzUser> getWzUser(String where){
		return  wzglDAO.getWzUser(where);	
	}
	
	public boolean modifyWzInputCheckin(String uidsStr){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate(); 
		String [] uidsArr = uidsStr.split(",");
		for(int i=0 ; i< uidsArr.length; i++){
			jdbc.update(" update wz_input set bill_state='Y' where uids='"+uidsArr[i]+"' ");
		}
		return true;
	}
	
	public boolean crateConMatFromCgjh(String conBh, ViewWzConCgjh hbm){
		boolean success = true;
		try{
			Object obj = this.wzglDAO.findById("com.sgepit.pmis.wzgl.hbm.WzCjhxb", hbm.getUids());		
			if(obj!=null){			
				WzCjhxb cjhxbHbm = (WzCjhxb)obj;				
				/*
				double dhsl = (cjhxbHbm.getDhsl() == null? 0:cjhxbHbm.getDhsl().doubleValue());
				double curDhsl = (hbm.getCurDhsl() == null? 0:hbm.getCurDhsl().doubleValue());
				cjhxbHbm.setDhsl(new Double(dhsl + curDhsl));*/
				
				ConMat conMatHbm = new ConMat();
				conMatHbm.setHth(conBh);
				conMatHbm.setPid(hbm.getPid());
				conMatHbm.setBm(hbm.getBm());
				conMatHbm.setPm(hbm.getPm());
				conMatHbm.setGg(hbm.getGg());
				conMatHbm.setDw(hbm.getDw());
				conMatHbm.setSl(hbm.getYgsl());
				conMatHbm.setJhdj(hbm.getJhdj());
				conMatHbm.setDj(hbm.getSjdj());				
				conMatHbm.setCgjhbh(hbm.getBh());
				conMatHbm.setDhrq(cjhxbHbm.getYjdhrq());
				conMatHbm.setZj((hbm.getYgsl()== null? 0 :hbm.getYgsl().doubleValue()) * (hbm.getSjdj()== null? 0 :hbm.getSjdj().doubleValue()));
				
				
				wzglDAO.saveOrUpdate(conMatHbm);
				cjhxbHbm.setHth(conBh);
				wzglDAO.saveOrUpdate(cjhxbHbm);
			}
		} catch(Exception e){
			e.printStackTrace();
			success = false;
		}			
		return success;
	}
	
	public Integer deleteConMat(String[] ida) throws Exception {
		int c = 0;
		for (int i = 0; i < ida.length; i++) {
			Object temp = this.wzglDAO.findById("com.sgepit.pmis.wzgl.hbm.ConMat", ida[i]);
			if (temp != null) {
				ConMat conMatHbm = (ConMat)temp;
				if (conMatHbm.getCgjhbh() != null && !conMatHbm.getCgjhbh().equals("计划外") && !conMatHbm.getCgjhbh().equals("")){
					List listCjhxb = this.wzglDAO.findByWhere("com.sgepit.pmis.wzgl.hbm.WzCjhxb", "bh='" +conMatHbm.getCgjhbh() + "' and bm='" +conMatHbm.getBm()+"'" );
					if(listCjhxb!=null){
						for(int index=0;index<listCjhxb.size();index++){
							//更新采购计划到货物资数量
							WzCjhxb cjhxbHbm = (WzCjhxb)listCjhxb.get(index);						
							cjhxbHbm.setHth("");
							this.wzglDAO.saveOrUpdate(cjhxbHbm);	
							
						}
					}
					
				}				
				//删除到货入库物资清单
				 this.wzglDAO.delete(conMatHbm);
				c++;
			}
		}
		return c;
	}
	//合同中选择库存物资
	public boolean createConMatFromStorage(String hth,WzBm [] wzbarr) {
		try{
			for(int i =0; i<wzbarr.length;i++){
				List matList =  this.wzglDAO.findByWhere("com.sgepit.pmis.wzgl.hbm.ConMat", "hth='"+hth+"' and bm='"+wzbarr[i].getBm()+"' ");
				System.out.println("--->"+matList.size());
				if(matList.size()==0){
					ConMat conMat = new ConMat();
					conMat.setHth(hth);
					//conMat.setBm(wzbarr[i].getUids());
					conMat.setBm(wzbarr[i].getBm());
					conMat.setDw(wzbarr[i].getDw());
					conMat.setGg(wzbarr[i].getGg());
					conMat.setPm(wzbarr[i].getPm());
					conMat.setPid(wzbarr[i].getPid());
					conMat.setJhdj(wzbarr[i].getJhdj());
					conMat.setCgjhbh("计划外");
					this.wzglDAO.saveOrUpdate(conMat);
				}
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		
	}
	
	//到货中选择库存物资
	public boolean createArriveMatFromStorage(String bh,WzBm [] wzbarr,  String fph,String userId) {
		try{
			for(int i =0; i<wzbarr.length;i++){
				WzInput inputHbm = new WzInput();
				inputHbm.setBh(getStockPlanNewBh(userId, "bh", "wz_input", null));
				inputHbm.setBillname("验收入库单");
				inputHbm.setHth("");
				inputHbm.setPid(wzbarr[i].getPid());
				inputHbm.setBm(wzbarr[i].getBm());
				inputHbm.setPm(wzbarr[i].getPm());
				inputHbm.setGg(wzbarr[i].getGg());
				inputHbm.setDw(wzbarr[i].getDw());
				//inputHbm.setSqsl(hbm.getCurDhsl());
				inputHbm.setJhdj(wzbarr[i].getJhdj());
				//inputHbm.setSjdj(hbm.getSjdj());				
				//申请计划编号
				inputHbm.setJhbh("计划外");
				//采购计划编号
				inputHbm.setCgbh("计划外");				
				inputHbm.setBillType("到货");
				inputHbm.setPbbh(bh);
				Object obj  = (WzCdjinPb)this.wzglDAO.findBeanByProperty("com.sgepit.pmis.wzgl.hbm.WzCdjinPb", "bh", bh);
				if(obj != null){
					//主表编号
					WzCdjinPb cdjInPbHbm = (WzCdjinPb)obj;
					inputHbm.setGhdw(cdjInPbHbm.getGhdw());		
					inputHbm.setZjbh(cdjInPbHbm.getFph() );
					inputHbm.setSv(cdjInPbHbm.getSv());					
				}				
				inputHbm.setCkh(wzbarr[i].getCkh());		
				inputHbm.setZjbh(fph);
				Date curDate = new Date();
				inputHbm.setRq(curDate);
				inputHbm.setZdrq(curDate);
				inputHbm.setQrrq(curDate);
				inputHbm.setBillState("N");
				this.wzglDAO.saveOrUpdate(inputHbm);
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		
	}
	
	public boolean saveArriveMatAfterEdit(WzInput wzInputHbm){
		boolean isOk = true;
		Double  curDhsl = wzInputHbm.getSqsl();
		String cgjhBh = wzInputHbm.getCgbh();
		String bm = wzInputHbm.getBm();
		//String 
		return isOk;
	}
	
	
	/*2010-01-10 保存汇总申请计划的物资
	 * 
	 */
	public boolean saveApplyHzSub(WzCjspbHzSub[] hzSubs,String uids,String bh){
		String beanName = "com.sgepit.pmis.wzgl.hbm.WzCjspbHzSub";
		try {
			for (int i = 0; i < hzSubs.length; i++) {
				WzCjspbHzSub hzSub = hzSubs[i];			
				hzSub.setHzuids(uids);
				hzSub.setSqjhhzbh(bh);
				hzSub.setCghzState("0");
				//hzSub.setSqjhbh("'"+hzSub.getSqjhbh()+"'");
				//查找本次添加物资是否存在，存在则追加，增加数量，拼接编号，单价求平均值，不存在则新增
				Double sum = 0.0;
				String str = "";
				String where = "bm='"+hzSub.getBm()+"' and hzuids='"+uids+"'";
				List<WzCjspbHzSub> list = this.wzglDAO.findByWhere(beanName, where);
				if(list.size()>0){
					WzCjspbHzSub sub = list.get(0);
					//处理单价,先求单价总和
					sum += (sub.getDj()*sub.getSqjhbh().split(",").length + hzSub.getDj());
					//申请计划编号，
					str += sub.getSqjhbh()+","+hzSub.getSqjhbh();
					
					sub.setSqjhbh(str);
					//平均单价
					sub.setDj(sum/str.split(",").length);
					//数量相加
					sub.setSqzsl(sub.getSqzsl()+hzSub.getSqzsl());
					this.wzglDAO.saveOrUpdate(sub);
				}else{
					this.wzglDAO.insert(hzSub);
				}
				//获取对应申请计划编号和细表中物资主键
				String wzBm = hzSub.getBm();
				String wzBh = hzSub.getSqjhbh();
				//修改申请计划细表中物资是否被申请计划汇总的状态
				String sql = "update wz_cjsxb set sqhz_state='1',hzbh='"+bh+"' where bm='"+wzBm+"' and bh='"+wzBh+"'";
				this.wzglDAO.updateBySQL(sql);
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/*2010-01-12 删除申请计划汇总主表，同时删除从表数据
	 * 
	 */
	public boolean deleteApplyHzById(String uids){
		String beanName = "com.sgepit.pmis.wzgl.hbm.WzCjspbHz";
		String beanNameSub = "com.sgepit.pmis.wzgl.hbm.WzCjspbHzSub";
		try {
			//删除主表
			WzCjspbHz hz = (WzCjspbHz) this.wzglDAO.findById(beanName, uids);
			this.wzglDAO.delete(hz);
			//删除从表
			List<WzCjspbHzSub> list = this.wzglDAO.findByProperty(beanNameSub, "hzuids", uids);
			if(list.size()>0){
				String docIDs = "";
				for (int i = 0; i < list.size(); i++) {				
					docIDs += "`" + list.get(i).getUids();							
				}
				if(docIDs.length()>0) {
					docIDs = docIDs.substring(1);
				}
				String[] uidArr = docIDs.split("`");
				deleteApplyHzSubById(uidArr);
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/*2010-01-14 删除申请计划汇总从表数据，
	 * 
	 */
	public boolean deleteApplyHzSubById(String[] uids){
		try {
			for (int i = 0; i < uids.length; i++) {
				WzCjspbHzSub hzSub = (WzCjspbHzSub) this.wzglDAO.findById("com.sgepit.pmis.wzgl.hbm.WzCjspbHzSub", uids[i]);
				//修改申请计划从表中物资汇总状态（SQHZ_STATE）
				//WzCjsxb wzCjsxb = (WzCjsxb) this.wzglDAO.findByWhere("com.sgepit.pmis.wzgl.hbm.WzCjsxb", "bm='"+hzSub.getBm()+"' and hzbh='"+hzSub.getSqjhhzbh()+"'");
				List<WzCjsxb> list = this.wzglDAO.findByWhere("com.sgepit.pmis.wzgl.hbm.WzCjsxb", "bm='"+hzSub.getBm()+"' and hzbh='"+hzSub.getSqjhhzbh()+"'");
				if(list.size()>0){
					for (int j = 0; j < list.size(); j++) {
						WzCjsxb wzCjsxb = list.get(j);
						wzCjsxb.setHzbh("");
						wzCjsxb.setSqhzState("0");
						this.wzglDAO.saveOrUpdate(wzCjsxb);
					}
				}
				this.wzglDAO.delete(hzSub);
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/*2010-01-13 从申请计划汇总中选择物资，保存到采购计划物资表
	 * 
	 */
	public boolean saveStockPlanWzFromApplyHz(String[] uids, String cgbh){
		try {
			for (int i = 0; i < uids.length; i++) {
				WzCjhxb cjhxb = new WzCjhxb();
				WzCjspbHzSub hzSub = (WzCjspbHzSub)this.wzglDAO.findById("com.sgepit.pmis.wzgl.hbm.WzCjspbHzSub", uids[i]);
				String wzbm = hzSub.getBm();
				String where = " bm='"+wzbm+"' and bh='"+cgbh+"'";
				List<WzCjhxb> list = this.wzglDAO.findByWhere("com.sgepit.pmis.wzgl.hbm.WzCjhxb", where);
				if(list.size()>0){
					cjhxb = list.get(0);
					cjhxb.setHzsl(cjhxb.getHzsl()+hzSub.getSqzsl());
					cjhxb.setYgsl(cjhxb.getYgsl()+hzSub.getSqzsl());
					//申请计划编号
					String sqjhbh = cjhxb.getSqjhbh();
					if(sqjhbh == null || sqjhbh.equals("")) {
						sqjhbh = hzSub.getSqjhbh();
					}else {
						sqjhbh = sqjhbh+","+hzSub.getSqjhbh();
					}
					cjhxb.setSqjhbh(sqjhbh);
					//申请计划汇总编号
					String sqjhhzbh = cjhxb.getSqjhhzbh();
					if(sqjhhzbh == null || sqjhhzbh.equals("")) {
						sqjhhzbh = hzSub.getSqjhhzbh();
					}else {
						sqjhhzbh = sqjhhzbh+","+hzSub.getSqjhhzbh();
					}
					cjhxb.setSqjhhzbh(sqjhhzbh);
					cjhxb.setPid(hzSub.getPid());
					this.wzglDAO.saveOrUpdate(cjhxb);
				}else{
					cjhxb.setBh(cgbh);
					cjhxb.setBm(hzSub.getBm());
					cjhxb.setPm(hzSub.getPm());
					cjhxb.setDj(hzSub.getDj());
					cjhxb.setDw(hzSub.getDw());
					cjhxb.setGg(hzSub.getGg());
					cjhxb.setHzsl(hzSub.getSqzsl());
					cjhxb.setYgsl(hzSub.getSqzsl());
					cjhxb.setSqjhbh(hzSub.getSqjhbh());
					cjhxb.setSqjhhzbh(hzSub.getSqjhhzbh());
					cjhxb.setHzState("1");
					cjhxb.setPid(hzSub.getPid());
					//可用库存
					double kysl = getUsedMatStorage(hzSub.getBm());
					cjhxb.setKcsl(kysl);
					this.wzglDAO.insert(cjhxb);
				}
				//在申请计划汇总物资表中存储采购计划编号
				hzSub.setJhbh(cgbh);
				hzSub.setCghzState("1");
				this.wzglDAO.saveOrUpdate(hzSub);
			}	
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/*2010-01-14 从未汇总的申请计划中选择物资，保存到采购计划物资表
	 * 
	 */
	public boolean saveStockPlanWzFromApply(String[] uids, String cgbh){
		try {
			for (int i = 0; i < uids.length; i++) {
				WzCjhxb cjhxb = new WzCjhxb();
				WzCjsxb sub = (WzCjsxb) this.wzglDAO.findById("com.sgepit.pmis.wzgl.hbm.WzCjsxb", uids[i]);
				String wzbm = sub.getBm();
				String where = " bm='"+wzbm+"' and bh='"+cgbh+"'";
				List<WzCjhxb> list = this.wzglDAO.findByWhere("com.sgepit.pmis.wzgl.hbm.WzCjhxb", where);
				if(list.size()>0){
					cjhxb = list.get(0);
					cjhxb.setHzsl(cjhxb.getHzsl()+sub.getSqsl());
					cjhxb.setYgsl(cjhxb.getYgsl()+sub.getSqsl());
					//申请计划编号
					String sqjhbh = cjhxb.getSqjhbh();
					if(sqjhbh == null || sqjhbh.equals("")) {
						sqjhbh = sub.getBh();
					}else {
						sqjhbh = sqjhbh+","+sub.getBh();
					}
					cjhxb.setSqjhbh(sqjhbh);
					cjhxb.setPid(sub.getPid());
					this.wzglDAO.saveOrUpdate(cjhxb);
				}else{
					cjhxb.setBh(cgbh);
					cjhxb.setBm(sub.getBm());
					cjhxb.setPm(sub.getPm());
					cjhxb.setDj(sub.getDj());
					cjhxb.setDw(sub.getDw());
					cjhxb.setGg(sub.getGg());
					cjhxb.setHzsl(sub.getSqsl());
					cjhxb.setYgsl(sub.getSqsl());
					cjhxb.setSqjhbh(sub.getBh());
					cjhxb.setHzState("0");
					cjhxb.setPid(sub.getPid());
					//可用库存
					double kysl = getUsedMatStorage(sub.getBm());
					cjhxb.setKcsl(kysl);
					this.wzglDAO.insert(cjhxb);
				}
				//在申请计划物资表中储存采购编号
				sub.setJhbh(cgbh);
				sub.setCghzState("1");
				this.wzglDAO.saveOrUpdate(sub);
			}	
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		
	}
	
	/**
	 * 删除申请计划，同时删除申请计划从表
	 * @param uids 申请计划主键
	 * @param bh 申请计划编号
	 * @return
	 */
	public boolean deleteApplyPlan(String uids,String bh){
		try {
			//删除主表
			WzCjspb cjspb = (WzCjspb) this.wzglDAO.findById("com.sgepit.pmis.wzgl.hbm.WzCjspb", uids);
			this.wzglDAO.delete(cjspb);
			//删除从表
			List<WzCjsxb> list = this.wzglDAO.findByWhere("com.sgepit.pmis.wzgl.hbm.WzCjsxb", "bh='"+bh+"'");
			this.wzglDAO.deleteAll(list);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * 国锦移植方法，流程中有用到
	 * @param dhbh
	 * @return
	 */
	public String getArriveBh(String dhbh){
		String bh = null;
		Object objBh = this.wzglDAO.findBeanByProperty("com.sgepit.pmis.wzgl.hbm.WzInput", "pbbh",dhbh);
		if (objBh!=null){
			WzInput input = (WzInput) objBh;
			 bh=input.getBh();
		}	
		return bh;
	}
}
