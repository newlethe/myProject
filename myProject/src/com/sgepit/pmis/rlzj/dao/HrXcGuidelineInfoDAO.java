package com.sgepit.pmis.rlzj.dao;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.pmis.rlzj.hbm.HrXcGuidelineInfo;

/**
 * A data access object (DAO) providing persistence and search support for
 * HrXcGuidelineInfo entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.sgepit.pmis.rlzj.hbm.HrXcGuidelineInfo
 * @author MyEclipse Persistence Tools
 */

public class HrXcGuidelineInfoDAO extends IBaseDAO {
	private static final Log log = LogFactory
			.getLog(HrXcGuidelineInfoDAO.class);
	// property constants
	public static final String ID = "id";
	public static final String NAME = "name";
	public static final String PARENTID = "parentid";
	public static final String SX_LB = "sxLb";
	public static final String SX_TABLE = "sxTable";
	public static final String JLDW = "jldw";
	public static final String ZBJD = "zbjd";
	public static final String FULLNAME = "fullname";
	public static final String REALNAME = "realname";
	public static final String IFPERCENT = "ifpercent";
	public static final String ZB_ZZLX = "zbZzlx";
	public static final String STATE = "state";
	public static final String GKBMLX = "gkbmlx";
	public static final String PXH = "pxh";
	public static final String PATH = "path";
	public static final String MEMO = "memo";
	public static final String INPUTTYPE = "inputtype";
	public static final String ZB_TRCC = "zbTrcc";
	public static final String IFZHFX = "ifzhfx";

	protected void initDao() {
		// do nothing
		sBeanName = "com.sgepit.pmis.rlzy.hbm.HrXcGuidelineInfo";
	}

	public void save(HrXcGuidelineInfo transientInstance) {
		log.debug("saving HrXcGuidelineInfo instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(HrXcGuidelineInfo persistentInstance) {
		log.debug("deleting HrXcGuidelineInfo instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public HrXcGuidelineInfo findById(java.lang.String id) {
		log.debug("getting HrXcGuidelineInfo instance with id: " + id);
		try {
			HrXcGuidelineInfo instance = (HrXcGuidelineInfo) getHibernateTemplate()
					.get("com.sgepit.pmis.rlzj.hbm.HrXcGuidelineInfo", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(HrXcGuidelineInfo instance) {
		log.debug("finding HrXcGuidelineInfo instance by example");
		try {
			List results = getHibernateTemplate().findByExample(instance);
			log.debug("find by example successful, result size: "
					+ results.size());
			return results;
		} catch (RuntimeException re) {
			log.error("find by example failed", re);
			throw re;
		}
	}

	public List findByProperty(String propertyName, Object value) {
		log.debug("finding HrXcGuidelineInfo instance with property: "
				+ propertyName + ", value: " + value);
		try {
			String queryString = "from HrXcGuidelineInfo as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List findById(Object id) {
		return findByProperty(ID, id);
	}

	public List findByName(Object name) {
		return findByProperty(NAME, name);
	}

	public List findByParentid(Object parentid) {
		return findByProperty(PARENTID, parentid);
	}

	public List findBySxLb(Object sxLb) {
		return findByProperty(SX_LB, sxLb);
	}

	public List findBySxTable(Object sxTable) {
		return findByProperty(SX_TABLE, sxTable);
	}

	public List findByJldw(Object jldw) {
		return findByProperty(JLDW, jldw);
	}

	public List findByZbjd(Object zbjd) {
		return findByProperty(ZBJD, zbjd);
	}

	public List findByFullname(Object fullname) {
		return findByProperty(FULLNAME, fullname);
	}

	public List findByRealname(Object realname) {
		return findByProperty(REALNAME, realname);
	}

	public List findByIfpercent(Object ifpercent) {
		return findByProperty(IFPERCENT, ifpercent);
	}

	public List findByZbZzlx(Object zbZzlx) {
		return findByProperty(ZB_ZZLX, zbZzlx);
	}

	public List findByState(Object state) {
		return findByProperty(STATE, state);
	}

	public List findByGkbmlx(Object gkbmlx) {
		return findByProperty(GKBMLX, gkbmlx);
	}

	public List findByPxh(Object pxh) {
		return findByProperty(PXH, pxh);
	}

	public List findByPath(Object path) {
		return findByProperty(PATH, path);
	}

	public List findByMemo(Object memo) {
		return findByProperty(MEMO, memo);
	}

	public List findByInputtype(Object inputtype) {
		return findByProperty(INPUTTYPE, inputtype);
	}

	public List findByZbTrcc(Object zbTrcc) {
		return findByProperty(ZB_TRCC, zbTrcc);
	}

	public List findByIfzhfx(Object ifzhfx) {
		return findByProperty(IFZHFX, ifzhfx);
	}

	public List findAll() {
		log.debug("finding all HrXcGuidelineInfo instances");
		try {
			String queryString = "from HrXcGuidelineInfo";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public HrXcGuidelineInfo merge(HrXcGuidelineInfo detachedInstance) {
		log.debug("merging HrXcGuidelineInfo instance");
		try {
			HrXcGuidelineInfo result = (HrXcGuidelineInfo) getHibernateTemplate()
					.merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(HrXcGuidelineInfo instance) {
		log.debug("attaching dirty HrXcGuidelineInfo instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(HrXcGuidelineInfo instance) {
		log.debug("attaching clean HrXcGuidelineInfo instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static HrXcGuidelineInfoDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (HrXcGuidelineInfoDAO) ctx.getBean("HrXcGuidelineInfoDAO");
	}
}