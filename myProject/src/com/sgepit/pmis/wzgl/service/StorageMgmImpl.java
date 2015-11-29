package com.sgepit.pmis.wzgl.service;

import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.UUIDGenerator;
import com.sgepit.pmis.wzgl.dao.WZglDAO;
import com.sgepit.pmis.wzgl.hbm.WzBm;
import com.sgepit.pmis.wzgl.hbm.WzCjspb;
import com.sgepit.pmis.wzgl.hbm.WzCkclb;
import com.sgepit.pmis.wzgl.hbm.WzOutput;

public class StorageMgmImpl implements StorageMgmFacade {
	private WZglDAO wzglDAO;
	public WZglDAO getWzglDAO() {
		return wzglDAO;
	}
	public void setWzglDAO(WZglDAO wzglDAO) {
		this.wzglDAO = wzglDAO;
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
	
	public boolean getGoods(String bh, String bm, Double sqsl,String userid,String username,String flwbh) {
		try{
			List<WzCjspb> cjspbList = this.wzglDAO.findByProperty("com.sgepit.pmis.wzgl.hbm.WzCjspb", "bh", bh);
			String bmmc="",jhlb="",xmbm="",bgdid="";
			WzCjspb temp = cjspbList.get(0);
			bmmc = temp.getBmmc();
			jhlb = temp.getJhlb();
			xmbm = temp.getXmbm();
			bgdid =temp.getBgdid();
			
			List<WzBm> wzbmList = this.wzglDAO.findByProperty("com.sgepit.pmis.wzgl.hbm.WzBm", "bm", bm);
			String pm="",gg="",dw="",ckh="";
			Double jhdj=0.0;
			WzBm tempwz = wzbmList.get(0);
			pm = tempwz.getPm();
			gg = tempwz.getGg();
			dw = tempwz.getDw();
			ckh =tempwz.getCkh();
			jhdj =tempwz.getJhdj();
			
			
			WzOutput wzoutput = new WzOutput();
			if("".equals(flwbh)||flwbh==null){
				wzoutput.setBh(getStockPlanNewBh(username+new SimpleDateFormat("yyyyMM").format(new Date()).substring(2,6),null));
			}else{
				wzoutput.setBh(flwbh);
			}
			wzoutput.setBm(bm);
			wzoutput.setJjr(userid);
			wzoutput.setLyr(userid);
			wzoutput.setSl(sqsl);
			wzoutput.setSqsl(sqsl);
			wzoutput.setBillname("领料出库单");
			//wzoutput.setBillState("-1");//0:未处理 -1:处理中 1:已处理 2:退回
			wzoutput.setBillState("N");
			wzoutput.setZdrq(new Date());
			wzoutput.setSqbm(bmmc);
			wzoutput.setPm(pm);
			wzoutput.setGg(gg);
			wzoutput.setJhdj_sl(jhdj*sqsl);
			wzoutput.setDw(dw);
			wzoutput.setCkh(ckh);
			wzoutput.setJhdj(jhdj);
			wzoutput.setJhbh(bh);
			wzoutput.setProjectId(xmbm);
			wzoutput.setProjectLb(jhlb);
			wzoutput.setBgdid(bgdid);
			wzoutput.setPid(this.getPid());
			this.wzglDAO.saveOrUpdate(wzoutput);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	
	public void updateBillState(String bh){
		/*String beanName = "com.sgepit.pmis.wzgl.hbm.WzOutput";
		WzOutput output = (WzOutput)this.wzglDAO.findBeanByProperty(beanName,"bh",bh);
		output.setBillState("-1");*/
		
		String sql = "update wz_output set bill_state='-1' where bh='"+bh+"'";
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		jdbc.update(sql);
		
	}
	/**
	 * @param prefix:编号前缀
	 * @param lsh：最大的流水号（null，表示没有传入，需要从数据库中获取）
	 * @return
	 */
	public String getStockPlanNewBh(String prefix, Long lsh){
		String bh="";
		String newLsh = "";
		if(lsh==null){
			String sql = "select trim(to_char(nvl(max(substr(bh,length('" + prefix + "') +1, 4)),0) +1,'0000')) from wz_output where substr(bh,1,length('" + prefix+ "')) ='" +  prefix +"'";
			List<String> list =  this.wzglDAO.getDataAutoCloseSes(sql);
			 if(list!=null){
				 newLsh = list.get(0);
			 }
		} else{
			NumberFormat ft = NumberFormat.getNumberInstance();
			ft.setMinimumIntegerDigits(4);
			ft.setGroupingUsed(false);
			newLsh = ft.format(lsh);
			
		}
		bh  = prefix.concat(newLsh);
		return bh;
	}
	
	
	public int  createMonthStock(String p_date,String p_sttime,Date p_edtime){
		int flag =0;
		try {
			String d_ettime = new SimpleDateFormat("yyyy-MM-dd").format(p_edtime);
			
			String v_tabName="WZ_STOCK"+p_date;
			if(this.checkWzStock(v_tabName)){
				return 2;//2标识已结算
			}else{
				JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
				List<Map> listtab = jdbc.queryForList("select max(tabname) tab from WZ_STOCK_TAB where tabname<>'"+v_tabName+"'");
				String tab = "";
				if(listtab!=null && listtab.size()>0){
					Map obj = listtab.get(0);
					tab =(String)obj.get("tab");
				}
				String [] sql = new String[2];
			    sql[0] = "create table  "+v_tabName+"  as "
                 + "select ta.bm,ta.pm,ta.gg,ta.dw,ta.jhdj,ta.ckh,ta.flbm,ta.stage,"
                 + "nvl(tc.stcount,0) stcount,nvl(tc.stcount,0)+nvl(tb.incount,0)-nvl(tb.outcount,0) edcount,"
                 + "nvl(tb.incount,0) incount,nvl(tb.outcount,0) outcount from "
                 + "(Select BM,PM,GG,DW,JHDJ,CKH,FLBM,STAGE From WZ_BM where bm_state='1') ta,"
                 + "(Select BM,nvl(Sum(decode(billType,'-1',sl,0)),0) incount,nvl(Sum(decode(billType,'1',sl,0)),0) outcount From view_wz_account Where QRRQ>=to_date('"+p_sttime+"','YYYY-MM-DD') And QRRQ<to_date('"+d_ettime+"','YYYY-MM-DD')+1 and (bill_state='Y' or bill_state='N')Group By bm) tb,"
                 + "(Select BM,nvl(edcount,0) As stcount From "+tab+") tc "
                 + "Where ta.bm=tb.bm(+) And ta.bm=tc.bm(+)";
				 sql[1]="insert Into Wz_Stock_Tab Values ('"+v_tabName+"',to_date('"+p_sttime+"','YYYY-MM-DD'),to_date('"+d_ettime+"','YYYY-MM-DD'))";
				 jdbc.execute(sql[0]);
				 jdbc.update(sql[1]);
				 flag = 1;
				
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			flag = 0;
		}
		return flag;
	}
	
	/**
	 * 是否已经结算
	 * @param tabname
	 * @return
	 */
	public boolean checkWzStock(String tabname){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List list = jdbc.queryForList("select * from WZ_STOCK_TAB where tabname='"+tabname+"' ") ;
		if(list.size()>0) return true;
		return false;
	}
	/**
	 * 删除已领料
	 * @return
	 */
	public boolean deleteGoods(String delbh,String delbm){
		try {
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			jdbc.execute("delete from wz_output where jhbh='"+delbh+"' and bm='"+delbm+"' and billName='领料出库单' and bill_state<>'1'");
			//jdbc.execute("delete from wz_output where jhbh='"+delbh+"' and billName='领料出库单'");
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	
	/**
	 * 国锦移植方法，计划内领用流程查看使用到
	 * @param bh
	 * @return
	 */
	public String getJhbh(String bh){
		String jhbh="";
		List list = this.wzglDAO.findByProperty("com.sgepit.pmis.wzgl.hbm.WzOutput", "bh", bh);
		if(list.size()>0){
			WzOutput wzoutput=(WzOutput)list.get(0);
			jhbh=wzoutput.getJhbh();
		}
		return jhbh;
	}
}
