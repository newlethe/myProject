package com.sgepit.pmis.rlzj.dao;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.pmis.rlzj.hbm.HrXcSalaryM;

/**
 * A data access object (DAO) providing persistence and search support for
 * HrXcSalaryM entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.sgepit.pmis.rlzj.hbm.HrXcSalaryM
 * @author MyEclipse Persistence Tools
 */

public class HrXcSalaryMDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(HrXcSalaryMDAO.class);
	// property constants
	public static final String SJ_TYPE = "sjType";
	public static final String UNIT_ID = "unitId";
	public static final String COUNT = "count";
	public static final String TITLE = "title";
	public static final String STATUS = "status";
	public static final String BILL_STATUS = "billStatus";
	public static final String MEMO = "memo";

	protected void initDao() {
		// do nothing
		sBeanName = "com.sgepit.pmis.rlzy.hbm.HrXcSalaryM";
	}

	public void save(HrXcSalaryM transientInstance) {
		log.debug("saving HrXcSalaryM instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(HrXcSalaryM persistentInstance) {
		log.debug("deleting HrXcSalaryM instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public HrXcSalaryM findById(java.lang.String id) {
		log.debug("getting HrXcSalaryM instance with id: " + id);
		try {
			HrXcSalaryM instance = (HrXcSalaryM) getHibernateTemplate().get(
					"com.sgepit.pmis.rlzj.hbm.HrXcSalaryM", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(HrXcSalaryM instance) {
		log.debug("finding HrXcSalaryM instance by example");
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
		log.debug("finding HrXcSalaryM instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from HrXcSalaryM as model where model."
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

	public List findByCount(Object count) {
		return findByProperty(COUNT, count);
	}

	public List findByTitle(Object title) {
		return findByProperty(TITLE, title);
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
		log.debug("finding all HrXcSalaryM instances");
		try {
			String queryString = "from HrXcSalaryM";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public HrXcSalaryM merge(HrXcSalaryM detachedInstance) {
		log.debug("merging HrXcSalaryM instance");
		try {
			HrXcSalaryM result = (HrXcSalaryM) getHibernateTemplate().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(HrXcSalaryM instance) {
		log.debug("attaching dirty HrXcSalaryM instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(HrXcSalaryM instance) {
		log.debug("attaching clean HrXcSalaryM instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static HrXcSalaryMDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (HrXcSalaryMDAO) ctx.getBean("HrXcSalaryMDAO");
	}
}