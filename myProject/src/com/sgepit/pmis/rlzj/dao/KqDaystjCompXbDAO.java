package com.sgepit.pmis.rlzj.dao;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.pmis.rlzj.hbm.KqDaystjCompXb;

/**
 * A data access object (DAO) providing persistence and search support for
 * KqDaystjCompXb entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.sgepit.pmis.rlzj.hbm.KqDaystjCompXb
 * @author MyEclipse Persistence Tools
 */

public class KqDaystjCompXbDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(KqDaystjCompXbDAO.class);
	// property constants
	public static final String MASTERLSH = "masterlsh";
	public static final String SJ_TYPE = "sjType";
	public static final String ZB_SEQNO = "zbSeqno";
	public static final String UNIT_ID = "unitId";
	public static final String VAL1 = "val1";
	public static final String VAL2 = "val2";
	public static final String VAL3 = "val3";
	public static final String MEMO = "memo";

	protected void initDao() {
		// do nothing
		sBeanName = "com.sgepit.pmis.rlzj.hbm.KqDaystjCompXb";
	}

	public void save(KqDaystjCompXb transientInstance) {
		log.debug("saving KqDaystjCompXb instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(KqDaystjCompXb persistentInstance) {
		log.debug("deleting KqDaystjCompXb instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public KqDaystjCompXb findById(java.lang.String id) {
		log.debug("getting KqDaystjCompXb instance with id: " + id);
		try {
			KqDaystjCompXb instance = (KqDaystjCompXb) getHibernateTemplate()
					.get("com.sgepit.pmis.rlzj.hbm.KqDaystjCompXb", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(KqDaystjCompXb instance) {
		log.debug("finding KqDaystjCompXb instance by example");
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
		log.debug("finding KqDaystjCompXb instance with property: "
				+ propertyName + ", value: " + value);
		try {
			String queryString = "from KqDaystjCompXb as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List findByMasterlsh(Object masterlsh) {
		return findByProperty(MASTERLSH, masterlsh);
	}

	public List findBySjType(Object sjType) {
		return findByProperty(SJ_TYPE, sjType);
	}

	public List findByZbSeqno(Object zbSeqno) {
		return findByProperty(ZB_SEQNO, zbSeqno);
	}

	public List findByUnitId(Object unitId) {
		return findByProperty(UNIT_ID, unitId);
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
		log.debug("finding all KqDaystjCompXb instances");
		try {
			String queryString = "from KqDaystjCompXb";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public KqDaystjCompXb merge(KqDaystjCompXb detachedInstance) {
		log.debug("merging KqDaystjCompXb instance");
		try {
			KqDaystjCompXb result = (KqDaystjCompXb) getHibernateTemplate()
					.merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(KqDaystjCompXb instance) {
		log.debug("attaching dirty KqDaystjCompXb instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(KqDaystjCompXb instance) {
		log.debug("attaching clean KqDaystjCompXb instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static KqDaystjCompXbDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (KqDaystjCompXbDAO) ctx.getBean("KqDaystjCompXbDAO");
	}
}