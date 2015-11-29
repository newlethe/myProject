package com.sgepit.pmis.rlzj.dao;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.pmis.rlzj.hbm.HrXcBaseModel;

/**
 * A data access object (DAO) providing persistence and search support for
 * HrXcBaseModel entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.sgepit.pmis.rlzj.hbm.HrXcBaseModel
 * @author MyEclipse Persistence Tools
 */

public class HrXcBaseModelDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(HrXcBaseModelDAO.class);
	// property constants
	public static final String SJ_TYPE = "sjType";
	public static final String UNIT_ID = "unitId";
	public static final String ZB_SEQNO = "zbSeqno";
	public static final String VAL1 = "val1";
	public static final String VAL2 = "val2";
	public static final String VAL3 = "val3";
	public static final String MEMO = "memo";

	protected void initDao() {
		// do nothing
		sBeanName = "com.sgepit.pmis.rlzy.hbm.HrXcBaseModel";
	}

	public void save(HrXcBaseModel transientInstance) {
		log.debug("saving HrXcBaseModel instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(HrXcBaseModel persistentInstance) {
		log.debug("deleting HrXcBaseModel instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public HrXcBaseModel findById(java.lang.String id) {
		log.debug("getting HrXcBaseModel instance with id: " + id);
		try {
			HrXcBaseModel instance = (HrXcBaseModel) getHibernateTemplate()
					.get("com.sgepit.pmis.rlzj.hbm.HrXcBaseModel", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(HrXcBaseModel instance) {
		log.debug("finding HrXcBaseModel instance by example");
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
		log.debug("finding HrXcBaseModel instance with property: "
				+ propertyName + ", value: " + value);
		try {
			String queryString = "from HrXcBaseModel as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List findBySjType(Object sjType) {
		return findByProperty(SJ_TYPE, sjType);
	}

	public List findByUnitId(Object unitId) {
		return findByProperty(UNIT_ID, unitId);
	}

	public List findByZbSeqno(Object zbSeqno) {
		return findByProperty(ZB_SEQNO, zbSeqno);
	}

	public List findByVal1(Object val1) {
		return findByProperty(VAL1, val1);
	}

	public List findByVal2(Object val2) {
		return findByProperty(VAL2, val2);
	}

	public List findByVal3(Object val3) {
		return findByProperty(VAL3, val3);
	}

	public List findByMemo(Object memo) {
		return findByProperty(MEMO, memo);
	}

	public List findAll() {
		log.debug("finding all HrXcBaseModel instances");
		try {
			String queryString = "from HrXcBaseModel";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public HrXcBaseModel merge(HrXcBaseModel detachedInstance) {
		log.debug("merging HrXcBaseModel instance");
		try {
			HrXcBaseModel result = (HrXcBaseModel) getHibernateTemplate()
					.merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(HrXcBaseModel instance) {
		log.debug("attaching dirty HrXcBaseModel instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(HrXcBaseModel instance) {
		log.debug("attaching clean HrXcBaseModel instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static HrXcBaseModelDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (HrXcBaseModelDAO) ctx.getBean("HrXcBaseModelDAO");
	}
}