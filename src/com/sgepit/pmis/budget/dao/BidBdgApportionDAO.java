package com.sgepit.pmis.budget.dao;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.util.JdbcUtil;

/**招标概算分摊dao
 * @author tengri
 *
 */
@SuppressWarnings("all")
public class BidBdgApportionDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(BdgMoneyDAO.class);
	
	protected void initDao() {
		super.initDao();
	}

	public static BidBdgApportionDAO getFromApplicationContext(ApplicationContext ctx) {
		return (BidBdgApportionDAO) ctx.getBean("bidBdgApportionDao");
	}
	
	
	public Double sumZbgsMoney(String bdgid) throws Exception{
		String sql = "select nvl(sum(t.plan_bgMoney),0) sumVal from pc_bid_bdg_apportion t where t.bdgid = '"+bdgid+"'";
		List<Map<String,BigDecimal>> list = JdbcUtil.query(sql);
		BigDecimal sum = list.get(0).get("sumVal");
		return Double.parseDouble(sum.toString());
	}

}
