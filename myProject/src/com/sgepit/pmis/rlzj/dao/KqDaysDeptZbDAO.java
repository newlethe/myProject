package com.sgepit.pmis.rlzj.dao;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.pmis.rlzj.hbm.KqDaysDeptZb;

/**
 * A data access object (DAO) providing persistence and search support for
 * KqDaysDeptZb entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.sgepit.pmis.rlzj.hbm.KqDaysDeptZb
 * @author MyEclipse Persistence Tools
 */

public class KqDaysDeptZbDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(KqDaysDeptZbDAO.class);
	// property constants
	public static final String SJ_TYPE = "sjType";
	public static final String UNIT_ID = "unitId";
	public static final String DEPT_ID = "deptId";
	public static final String TITLE = "title";
	public static final String USER_ID = "userId";
	public static final String STATUS = "status";
	public static final String BILL_STATUS = "billStatus";
	public static final String MEMO = "memo";

	protected void initDao() {
		// do nothing
		sBeanName = "com.sgepit.pmis.rlzj.hbm.KqDaysDeptZb";
	}

	public void save(KqDaysDeptZb transientInstance) {
		log.debug("saving KqDaysDeptZb instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(KqDaysDeptZb persistentInstance) {
		log.debug("deleting KqDaysDeptZb instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public KqDaysDeptZb findById(java.lang.String id) {
		log.debug("getting KqDaysDeptZb instance with id: " + id);
		try {
			KqDaysDeptZb instance = (KqDaysDeptZb) getHibernateTemplate().get(
					"com.sgepit.pmis.rlzj.hbm.KqDaysDeptZb", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(KqDaysDeptZb instance) {
		log.debug("finding KqDaysDeptZb instance by example");
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
		log.debug("finding KqDaysDeptZb instance with property: "
				+ propertyName + ", value: " + value);
		try {
			String queryString = "from KqDaysDeptZb as model where model."
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

	public List findByDeptId(Object deptId) {
		return findByProperty(DEPT_ID, deptId);
	}

	public List findByTitle(Object title) {
		return findByProperty(TITLE, title);
	}

	public List findByUserId(Object userId) {
		return findByProperty(USER_ID, userId);
	}

	public List findByStatus(Object status) {
		return findByProperty(STATUS, status);
	}

	public List findByBillStatus(Object billStatus) {
		return findByProperty(BILL_STATUS, billStatus);
	}

	public List findByMemo(Object memo) {
		return findByProperty(MEMO, memo);
	}

	public List findAll() {
		log.debug("finding all KqDaysDeptZb instances");
		try {
			String queryString = "from KqDaysDeptZb";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public KqDaysDeptZb merge(KqDaysDeptZb detachedInstance) {
		log.debug("merging KqDaysDeptZb instance");
		try {
			KqDaysDeptZb result = (KqDaysDeptZb) getHibernateTemplate().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(KqDaysDeptZb instance) {
		log.debug("attaching dirty KqDaysDeptZb instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(KqDaysDeptZb instance) {
		log.debug("attaching clean KqDaysDeptZb instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static KqDaysDeptZbDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (KqDaysDeptZbDAO) ctx.getBean("KqDaysDeptZbDAO");
	}
}